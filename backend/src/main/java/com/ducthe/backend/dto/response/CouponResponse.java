package com.ducthe.backend.dto.response;

import com.ducthe.backend.enums.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record CouponResponse(
        UUID id,
        String code,
        String description,
        DiscountType discountType,
        BigDecimal discountValue,
        BigDecimal maxDiscountAmount,
        BigDecimal minOrderAmount,
        Integer usageLimit,
        int usedCount,
        LocalDateTime startDate,
        LocalDateTime endDate,
        boolean active
) {
}
