package com.ducthe.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public record CouponApplyRequest(
        @NotBlank String code,
        @NotNull @PositiveOrZero BigDecimal subtotal,
        @NotNull @PositiveOrZero BigDecimal shippingFee
) {
}
