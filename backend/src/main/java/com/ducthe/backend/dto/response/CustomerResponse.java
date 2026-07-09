package com.ducthe.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record CustomerResponse(
        UUID id,
        String fullName,
        String email,
        String phone,
        boolean enabled,
        LocalDateTime createdAt
) {
}
