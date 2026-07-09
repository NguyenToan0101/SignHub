package com.ducthe.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record BlogPostResponse(
        UUID id,
        String title,
        String slug,
        String thumbnailUrl,
        String summary,
        String content,
        boolean published,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
