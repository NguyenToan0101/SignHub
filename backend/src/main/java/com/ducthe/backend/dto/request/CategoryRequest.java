package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record CategoryRequest(
        @NotBlank String name,
        String slug,
        String description,
        String imageUrl,
        UUID parentCategoryId,
        Boolean active
) {
}
