package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record ProductVariantRequest(
        @NotBlank String size,
        @NotNull @PositiveOrZero BigDecimal extraPrice,
        @PositiveOrZero Integer stockQuantity,
        Boolean active
) {
}
