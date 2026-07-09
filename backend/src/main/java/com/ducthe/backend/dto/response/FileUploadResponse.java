package com.ducthe.backend.dto.response;

public record FileUploadResponse(
        String url,
        String key,
        String fileName,
        String contentType,
        long size
) {
}
