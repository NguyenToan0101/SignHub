package com.ducthe.backend.dto.response;

import com.ducthe.backend.enums.OrderStatus;
import com.ducthe.backend.enums.PaymentMethod;
import com.ducthe.backend.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String orderCode,
        AddressResponse billingAddress,
        AddressResponse shippingAddress,
        boolean shipToDifferentAddress,
        String note,
        BigDecimal subtotal,
        BigDecimal shippingFee,
        BigDecimal discountAmount,
        BigDecimal totalAmount,
        PaymentMethod paymentMethod,
        PaymentStatus paymentStatus,
        OrderStatus orderStatus,
        String couponCode,
        List<OrderItemResponse> items,
        LocalDateTime createdAt
) {
}
