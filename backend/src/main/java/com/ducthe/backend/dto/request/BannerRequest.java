package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;

public record BannerRequest(
        @NotBlank String title,
        String subtitle,
        String imageUrl,
        String linkUrl,
        Boolean active,
        Integer sortOrder
) {
}
