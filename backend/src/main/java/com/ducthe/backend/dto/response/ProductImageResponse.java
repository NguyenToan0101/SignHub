package com.ducthe.backend.dto.response;

import java.util.UUID;

public record ProductImageResponse(UUID id, String imageUrl, boolean mainImage, int sortOrder) {
}
