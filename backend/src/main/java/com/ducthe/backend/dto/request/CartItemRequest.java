package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CartItemRequest(
        @NotNull UUID productId,
        UUID variantId,
        @Min(1) int quantity,
        String sessionId
) {
}
