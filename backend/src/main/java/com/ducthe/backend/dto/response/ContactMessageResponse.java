package com.ducthe.backend.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ContactMessageResponse(UUID id, String fullName, String email, String phone, String message, boolean replied, LocalDateTime createdAt) {
}
