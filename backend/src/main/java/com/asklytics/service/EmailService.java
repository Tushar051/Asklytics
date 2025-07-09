package com.asklytics.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String token, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Verify Your Email - Asklytics");
            message.setText(createVerificationEmailContent(token, name));
            
            mailSender.send(message);
            logger.info("Verification email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send verification email to: {}", to, e);
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public void sendPasswordResetEmail(String to, String token, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Reset Your Password - Asklytics");
            message.setText(createPasswordResetEmailContent(token, name));
            
            mailSender.send(message);
            logger.info("Password reset email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", to, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendOtpEmail(String to, String otp, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your OTP Code - Asklytics");
            message.setText(createOtpEmailContent(otp, name));
            
            mailSender.send(message);
            logger.info("OTP email sent to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send OTP email to: {}", to, e);
            throw new RuntimeException("Failed to send OTP email", e);
        }
    }

    private String createVerificationEmailContent(String token, String name) {
        return String.format(
            "Hello %s,\n\n" +
            "Thank you for registering with Asklytics! Please click the link below to verify your email address:\n\n" +
            "http://localhost:3000/verify-email?token=%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you didn't create an account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Asklytics Team",
            name, token
        );
    }

    private String createPasswordResetEmailContent(String token, String name) {
        return String.format(
            "Hello %s,\n\n" +
            "You requested to reset your password. Please click the link below to reset your password:\n\n" +
            "http://localhost:3000/reset-password?token=%s\n\n" +
            "This link will expire in 1 hour.\n\n" +
            "If you didn't request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Asklytics Team",
            name, token
        );
    }

    private String createOtpEmailContent(String otp, String name) {
        return String.format(
            "Hello %s,\n\n" +
            "Your OTP code for Asklytics is: %s\n\n" +
            "This code will expire in 10 minutes.\n\n" +
            "If you didn't request this code, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The Asklytics Team",
            name, otp
        );
    }
} 