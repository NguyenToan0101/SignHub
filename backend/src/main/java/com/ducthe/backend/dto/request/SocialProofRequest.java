package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record SocialProofRequest(
        @NotBlank String customerName,
        @NotBlank String productName,
        @NotBlank String message,
        Integer minutesAgo,
        Boolean active
) {
}
