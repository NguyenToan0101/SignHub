package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record AddressRequest(
        @NotBlank String fullName,
        @NotBlank String phone,
        String email,
        @NotBlank String province,
        @NotBlank String district,
        @NotBlank String ward,
        @NotBlank String detailAddress
) {
}
