package com.ducthe.backend.dto.request;

import com.ducthe.backend.enums.DiscountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CouponRequest(
        @NotBlank String code,
        String description,
        @NotNull DiscountType discountType,
        @NotNull @PositiveOrZero BigDecimal discountValue,
        BigDecimal maxDiscountAmount,
        BigDecimal minOrderAmount,
        Integer usageLimit,
        LocalDateTime startDate,
        LocalDateTime endDate,
        Boolean active
) {
}
