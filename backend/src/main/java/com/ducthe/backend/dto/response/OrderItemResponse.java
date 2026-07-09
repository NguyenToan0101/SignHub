package com.ducthe.backend.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(UUID id, UUID productId, String productName, String productCode, String variantSize, int quantity, BigDecimal unitPrice, BigDecimal totalPrice, String thumbnailUrl) {
}
