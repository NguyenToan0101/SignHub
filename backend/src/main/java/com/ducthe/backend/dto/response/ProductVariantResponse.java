package com.ducthe.backend.dto.response;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductVariantResponse(UUID id, String size, BigDecimal extraPrice, int stockQuantity, boolean active) {
}
