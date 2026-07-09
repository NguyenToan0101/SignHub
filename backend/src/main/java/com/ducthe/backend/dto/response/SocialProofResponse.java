package com.ducthe.backend.dto.response;

import java.util.UUID;

public record SocialProofResponse(UUID id, String customerName, String productName, String message, int minutesAgo, boolean active) {
}
