package com.ducthe.backend.dto.request;

import com.ducthe.backend.enums.PaymentMethod;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

public record OrderRequest(
        String sessionId,
        @Valid @NotNull AddressRequest billingAddress,
        @Valid AddressRequest shippingAddress,
        Boolean shipToDifferentAddress,
        String note,
        String couponCode,
        @NotNull PaymentMethod paymentMethod
) {
}
