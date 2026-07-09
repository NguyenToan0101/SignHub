package com.ducthe.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ReviewResponse(UUID id, String customerName, int rating, String content, LocalDateTime createdAt) {
}
