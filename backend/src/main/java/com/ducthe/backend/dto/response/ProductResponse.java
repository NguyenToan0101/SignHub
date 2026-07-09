package com.ducthe.backend.dto.response;

import com.ducthe.backend.enums.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String slug,
        String code,
        String shortDescription,
        String description,
        String material,
        String thickness,
        String weight,
        BigDecimal basePrice,
        ProductStatus status,
        boolean featured,
        long soldCount,
        CategoryResponse category,
        List<ProductImageResponse> images,
        List<ProductVariantResponse> variants,
        List<ReviewResponse> reviews,
        LocalDateTime createdAt
) {
}
