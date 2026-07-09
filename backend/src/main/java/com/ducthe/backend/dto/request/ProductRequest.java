package com.ducthe.backend.dto.request;

import com.ducthe.backend.enums.ProductStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductRequest(
        @NotBlank String name,
        String slug,
        @NotBlank String code,
        String shortDescription,
        String description,
        String material,
        String thickness,
        String weight,
        @NotNull @PositiveOrZero BigDecimal basePrice,
        ProductStatus status,
        Boolean featured,
        UUID categoryId,
        @Valid List<ProductImageRequest> images,
        @Valid List<ProductVariantRequest> variants
) {
}
