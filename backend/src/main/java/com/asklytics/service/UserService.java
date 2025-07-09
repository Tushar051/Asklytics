package com.asklytics.service;

import com.asklytics.dto.UserDto;
import com.asklytics.model.User;
import com.asklytics.repository.UserRepository;
import com.asklytics.security.JwtTokenProvider;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return user;
    }

    public User registerUser(User user) {
        // Check if user already exists
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("User with this email already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        user.setEmailVerified(false);
        user.setAccountLocked(false);
        user.setFailedLoginAttempts(0);

        // Generate email verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));

        // Save user
        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(user.getEmail(), verificationToken, user.getName());
        } catch (Exception e) {
            logger.error("Failed to send verification email", e);
            // Don't fail registration if email fails
        }

        return savedUser;
    }

    public Authentication authenticateUser(String email, String password) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

            if (user.isAccountLocked()) {
                throw new LockedException("Account is locked due to too many failed login attempts");
            }

            if (!passwordEncoder.matches(password, user.getPassword())) {
                handleFailedLogin(email);
                throw new BadCredentialsException("Invalid credentials");
            }

            // Reset failed login attempts on successful login
            user.setFailedLoginAttempts(0);
            user.setAccountLocked(false);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
        } catch (BadCredentialsException e) {
            handleFailedLogin(email);
            throw e;
        } catch (LockedException e) {
            throw new RuntimeException("Account is locked due to too many failed login attempts");
        }
    }

    private void handleFailedLogin(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

            if (user.getFailedLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                user.setAccountLocked(true);
                logger.warn("Account locked for user: {}", email);
            }

            userRepository.save(user);
        }
    }

    public boolean verifyEmail(String token) {
        Optional<User> userOpt = userRepository.findByEmailVerificationTokenAndExpiryAfter(
                token, LocalDateTime.now());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setEmailVerified(true);
            user.setEmailVerificationToken(null);
            user.setEmailVerificationExpiry(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is already verified");
        }

        // Generate new verification token
        String verificationToken = UUID.randomUUID().toString();
        user.setEmailVerificationToken(verificationToken);
        user.setEmailVerificationExpiry(LocalDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), verificationToken, user.getName());
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        user.setResetPasswordExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getName());
    }

    public boolean resetPassword(String token, String newPassword) {
        Optional<User> userOpt = userRepository.findByResetPasswordTokenAndExpiryAfter(
                token, LocalDateTime.now());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetPasswordToken(null);
            user.setResetPasswordExpiry(null);
            user.setFailedLoginAttempts(0);
            user.setAccountLocked(false);
            userRepository.save(user);
            return true;
        }
        return false;
    }

    public String generateOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate 6-digit OTP
        SecureRandom random = new SecureRandom();
        String otp = String.format("%06d", random.nextInt(1000000));

        // Store OTP in user record with 10-minute expiry
        user.setOtpCode(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send OTP email
        emailService.sendOtpEmail(user.getEmail(), otp, user.getName());

        return otp; // In production, return success message instead of OTP
    }

    public Authentication verifyOtpAndLogin(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if OTP exists and is not expired
        if (user.getOtpCode() == null || user.getOtpExpiry() == null) {
            throw new RuntimeException("No OTP found. Please generate a new OTP.");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            // Clear expired OTP
            user.setOtpCode(null);
            user.setOtpExpiry(null);
            userRepository.save(user);
            throw new RuntimeException("OTP has expired. Please generate a new OTP.");
        }

        // Verify OTP
        if (!user.getOtpCode().equals(otp)) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }

        // Clear OTP after successful verification
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }

    public UserDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return convertToDto(user);
    }

    public UserDto updateUserProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(userDto.getName());
        user.setPhoneNumber(userDto.getPhoneNumber());
        user.setCompany(userDto.getCompany());
        user.setGender(userDto.getGender());

        User updatedUser = userRepository.save(user);
        return convertToDto(updatedUser);
    }

    public void changePassword(String email, String currentPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setGender(user.getGender());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setCompany(user.getCompany());
        dto.setRole(user.getRole());
        dto.setEmailVerified(user.isEmailVerified());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
} 