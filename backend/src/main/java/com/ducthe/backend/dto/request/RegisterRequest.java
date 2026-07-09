package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Full name is required.") String fullName,
        @NotBlank(message = "Email is required.") @Email(message = "Email is invalid.") String email,
        @NotBlank(message = "Password is required.") @Size(min = 3, message = "Password must be at least 3 characters.") String password,
        @NotBlank(message = "Password confirmation is required.") @Size(min = 3, message = "Password confirmation must be at least 3 characters.") String confirmPassword
) {
}
