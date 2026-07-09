package com.ducthe.backend.dto.response;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String slug,
        String description,
        String imageUrl,
        UUID parentCategoryId,
        boolean active
) {
}
