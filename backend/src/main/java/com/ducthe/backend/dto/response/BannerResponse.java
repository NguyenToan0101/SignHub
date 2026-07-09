package com.ducthe.backend.dto.response;

import java.util.UUID;

public record BannerResponse(UUID id, String title, String subtitle, String imageUrl, String linkUrl, boolean active, int sortOrder) {
}
