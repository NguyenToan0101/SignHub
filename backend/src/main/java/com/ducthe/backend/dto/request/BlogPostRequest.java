package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BlogPostRequest(
        @NotBlank String title,
        String slug,
        String thumbnailUrl,
        String summary,
        String content,
        Boolean published
) {
}
