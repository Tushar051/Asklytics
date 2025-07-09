package com.asklytics.controller;

import com.asklytics.dto.AuthResponse;
import com.asklytics.dto.LoginRequest;
import com.asklytics.dto.RegisterRequest;
import com.asklytics.dto.UserDto;
import com.asklytics.model.User;
import com.asklytics.security.JwtTokenProvider;
import com.asklytics.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            logger.info("Registration attempt for email: {}", registerRequest.getEmail());

            // Create user from request
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(registerRequest.getPassword());
            user.setGender(registerRequest.getGender());
            user.setPhoneNumber(registerRequest.getPhoneNumber());
            user.setCompany(registerRequest.getCompany());

            // Register user
            User registeredUser = userService.registerUser(user);

            // Convert to DTO
            UserDto userDto = new UserDto();
            userDto.setId(registeredUser.getId());
            userDto.setName(registeredUser.getName());
            userDto.setEmail(registeredUser.getEmail());
            userDto.setGender(registeredUser.getGender());
            userDto.setRole(registeredUser.getRole());
            userDto.setEmailVerified(registeredUser.isEmailVerified());

            return ResponseEntity.ok(AuthResponse.success(
                "Registration successful! Please check your email to verify your account.",
                null, null, null, userDto
            ));
        } catch (Exception e) {
            logger.error("Registration failed for email: {}", registerRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for email: {}", loginRequest.getEmail());

            // Authenticate user
            Authentication authentication = userService.authenticateUser(
                loginRequest.getEmail(), loginRequest.getPassword()
            );

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            // Get user details
            User user = (User) authentication.getPrincipal();
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());
            userDto.setGender(user.getGender());
            userDto.setRole(user.getRole());
            userDto.setEmailVerified(user.isEmailVerified());
            userDto.setLastLoginAt(user.getLastLoginAt());
            userDto.setCreatedAt(user.getCreatedAt());

            return ResponseEntity.ok(AuthResponse.success(
                "Login successful!",
                accessToken,
                refreshToken,
                jwtTokenProvider.getExpirationTime(),
                userDto
            ));
        } catch (BadCredentialsException e) {
            logger.warn("Invalid credentials for email: {}", loginRequest.getEmail());
            return ResponseEntity.badRequest().body(AuthResponse.error("Invalid email or password"));
        } catch (Exception e) {
            logger.error("Login failed for email: {}", loginRequest.getEmail(), e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestParam String token) {
        try {
            logger.info("Email verification attempt with token: {}", token);

            boolean verified = userService.verifyEmail(token);
            if (verified) {
                return ResponseEntity.ok(AuthResponse.success("Email verified successfully!"));
            } else {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid or expired verification token"));
            }
        } catch (Exception e) {
            logger.error("Email verification failed", e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<AuthResponse> resendVerificationEmail(@RequestParam String email) {
        try {
            logger.info("Resend verification email for: {}", email);

            userService.resendVerificationEmail(email);
            return ResponseEntity.ok(AuthResponse.success("Verification email sent successfully!"));
        } catch (Exception e) {
            logger.error("Failed to resend verification email for: {}", email, e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(@RequestParam String email) {
        try {
            logger.info("Password reset request for email: {}", email);

            userService.forgotPassword(email);
            return ResponseEntity.ok(AuthResponse.success("Password reset email sent successfully!"));
        } catch (Exception e) {
            logger.error("Failed to send password reset email for: {}", email, e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        try {
            logger.info("Password reset attempt with token: {}", token);

            boolean reset = userService.resetPassword(token, newPassword);
            if (reset) {
                return ResponseEntity.ok(AuthResponse.success("Password reset successfully!"));
            } else {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid or expired reset token"));
            }
        } catch (Exception e) {
            logger.error("Password reset failed", e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/generate-otp")
    public ResponseEntity<Map<String, Object>> generateOtp(@RequestParam String email) {
        try {
            logger.info("OTP generation request for email: {}", email);

            String otp = userService.generateOtp(email);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "OTP sent successfully!");
            response.put("otp", otp); // In production, don't return OTP in response
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Failed to generate OTP for: {}", email, e);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@RequestParam String email, @RequestParam String otp) {
        try {
            logger.info("OTP verification attempt for email: {}", email);

            // Verify OTP and get authentication
            Authentication authentication = userService.verifyOtpAndLogin(email, otp);

            // Generate tokens
            String accessToken = jwtTokenProvider.generateAccessToken(authentication);
            String refreshToken = jwtTokenProvider.generateRefreshToken(authentication);

            // Get user details
            User user = (User) authentication.getPrincipal();
            UserDto userDto = new UserDto();
            userDto.setId(user.getId());
            userDto.setName(user.getName());
            userDto.setEmail(user.getEmail());
            userDto.setGender(user.getGender());
            userDto.setRole(user.getRole());
            userDto.setEmailVerified(user.isEmailVerified());
            userDto.setLastLoginAt(user.getLastLoginAt());
            userDto.setCreatedAt(user.getCreatedAt());

            return ResponseEntity.ok(AuthResponse.success(
                "OTP verification successful!",
                accessToken,
                refreshToken,
                jwtTokenProvider.getExpirationTime(),
                userDto
            ));
        } catch (Exception e) {
            logger.error("OTP verification failed for email: {}", email, e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String refreshToken) {
        try {
            logger.info("Token refresh attempt");

            if (jwtTokenProvider.validateToken(refreshToken)) {
                String email = jwtTokenProvider.getEmailFromToken(refreshToken);
                String newAccessToken = jwtTokenProvider.generateAccessToken(email);
                String newRefreshToken = jwtTokenProvider.generateRefreshToken(email);

                return ResponseEntity.ok(AuthResponse.success(
                    "Token refreshed successfully!",
                    newAccessToken,
                    newRefreshToken,
                    jwtTokenProvider.getExpirationTime(),
                    null
                ));
            } else {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid refresh token"));
            }
        } catch (Exception e) {
            logger.error("Token refresh failed", e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getProfile(@RequestParam String email) {
        try {
            logger.info("Profile request for email: {}", email);

            UserDto userDto = userService.getUserProfile(email);
            return ResponseEntity.ok(userDto);
        } catch (Exception e) {
            logger.error("Failed to get profile for: {}", email, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateProfile(
            @RequestParam String email,
            @Valid @RequestBody UserDto userDto) {
        try {
            logger.info("Profile update request for email: {}", email);

            UserDto updatedUser = userService.updateUserProfile(email, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            logger.error("Failed to update profile for: {}", email, e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(
            @RequestParam String email,
            @RequestParam String currentPassword,
            @RequestParam String newPassword) {
        try {
            logger.info("Password change request for email: {}", email);

            userService.changePassword(email, currentPassword, newPassword);
            return ResponseEntity.ok(AuthResponse.success("Password changed successfully!"));
        } catch (Exception e) {
            logger.error("Failed to change password for: {}", email, e);
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout() {
        // In a stateless JWT setup, logout is typically handled on the client side
        // by removing the token from storage
        return ResponseEntity.ok(AuthResponse.success("Logged out successfully!"));
    }
} 