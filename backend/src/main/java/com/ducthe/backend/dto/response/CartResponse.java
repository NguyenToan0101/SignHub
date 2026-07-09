package com.ducthe.backend.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record CartResponse(UUID id, String sessionId, List<CartItemResponse> items, BigDecimal subtotal) {
}
