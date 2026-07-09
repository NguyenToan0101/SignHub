package com.ducthe.backend.controller;

import com.ducthe.backend.dto.request.LoginRequest;
import com.ducthe.backend.dto.request.RegisterRequest;
import com.ducthe.backend.dto.response.AuthResponse;
import com.ducthe.backend.service.CustomerAuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final CustomerAuthService customerAuthService;

    public AuthController(CustomerAuthService customerAuthService) {
        this.customerAuthService = customerAuthService;
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return customerAuthService.login(request);
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return customerAuthService.register(request);
    }
}
