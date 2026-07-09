package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ProductImageRequest(
        @NotBlank String imageUrl,
        Boolean mainImage,
        Integer sortOrder
) {
}
