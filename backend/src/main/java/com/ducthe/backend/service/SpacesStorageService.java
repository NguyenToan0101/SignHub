package com.ducthe.backend.service;

import com.ducthe.backend.dto.response.FileUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface SpacesStorageService {
    FileUploadResponse uploadProductImage(MultipartFile file);
}
