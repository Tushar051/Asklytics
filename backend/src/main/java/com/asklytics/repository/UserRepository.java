package com.asklytics.repository;

import com.asklytics.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("{'emailVerificationToken': ?0, 'emailVerificationExpiry': {$gt: ?1}}")
    Optional<User> findByEmailVerificationTokenAndExpiryAfter(String token, LocalDateTime now);

    @Query("{'resetPasswordToken': ?0, 'resetPasswordExpiry': {$gt: ?1}}")
    Optional<User> findByResetPasswordTokenAndExpiryAfter(String token, LocalDateTime now);

    List<User> findByEmailVerified(boolean emailVerified);

    List<User> findByRole(String role);

    @Query("{'failedLoginAttempts': {$gte: 5}, 'accountLocked': true}")
    List<User> findLockedAccounts();

    @Query("{'lastLoginAt': {$lt: ?0}}")
    List<User> findInactiveUsers(LocalDateTime threshold);

    void deleteByEmail(String email);
} 