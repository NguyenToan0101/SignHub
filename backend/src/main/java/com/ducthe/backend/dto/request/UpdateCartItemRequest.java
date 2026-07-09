package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.Min;

public record UpdateCartItemRequest(
        @Min(1) int quantity,
        String sessionId
) {
}
