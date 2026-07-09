package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminProfileRequest(
        @NotBlank String fullName,
        @Email @NotBlank String email,
        String phone
) {
}
