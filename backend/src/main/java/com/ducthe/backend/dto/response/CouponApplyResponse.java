package com.ducthe.backend.dto.response;

import java.math.BigDecimal;

public record CouponApplyResponse(String code, BigDecimal discountAmount, BigDecimal shippingFee, BigDecimal totalAmount) {
}
