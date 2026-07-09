package com.ducthe.backend.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record CartItemResponse(
        UUID id,
        UUID productId,
        String productName,
        String productSlug,
        String productCode,
        String thumbnailUrl,
        UUID variantId,
        String variantSize,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal totalPrice
) {
}
