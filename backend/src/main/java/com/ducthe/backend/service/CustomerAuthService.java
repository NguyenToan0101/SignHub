package com.ducthe.backend.service;

import com.ducthe.backend.dto.request.LoginRequest;
import com.ducthe.backend.dto.request.RegisterRequest;
import com.ducthe.backend.dto.response.AuthResponse;
import com.ducthe.backend.entity.User;
import com.ducthe.backend.enums.RoleName;
import com.ducthe.backend.exception.BadRequestException;
import com.ducthe.backend.repository.UserRepository;
import com.ducthe.backend.security.JwtService;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class CustomerAuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public CustomerAuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(() -> new BadCredentialsException("Email or password is incorrect."));
        if (user.getRole() != RoleName.CUSTOMER || !passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadCredentialsException("Email or password is incorrect.");
        }
        return authResponse(user);
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("Password confirmation does not match.");
        }

        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new BadRequestException("This email has already been registered.");
        }

        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.password()))
                .role(RoleName.CUSTOMER)
                .enabled(true)
                .build();

        return authResponse(userRepository.save(user));
    }

    @Transactional
    public User findOrCreateGoogleCustomer(String email, String name) {
        String normalizedEmail = normalizeEmail(email);
        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseGet(() -> User.builder()
                        .fullName(displayName(name, normalizedEmail))
                        .email(normalizedEmail)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(RoleName.CUSTOMER)
                        .enabled(true)
                        .build());

        if (user.getRole() != RoleName.CUSTOMER) {
            throw new BadRequestException("Admin accounts must sign in from the admin page.");
        }

        if (user.getFullName() == null || user.getFullName().isBlank()) {
            user.setFullName(displayName(name, normalizedEmail));
        }
        user.setEmail(normalizedEmail);
        user.setEnabled(true);
        return userRepository.save(user);
    }

    public AuthResponse authResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, "Bearer", user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }

    private String displayName(String name, String email) {
        if (name != null && !name.isBlank()) {
            return name.trim();
        }
        return email.split("@")[0];
    }
}
