package com.ducthe.backend.dto.request;

import com.ducthe.backend.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateRequest(@NotNull OrderStatus status) {
}
