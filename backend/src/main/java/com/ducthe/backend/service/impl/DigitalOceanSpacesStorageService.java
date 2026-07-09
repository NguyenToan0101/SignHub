package com.ducthe.backend.service.impl;

import com.ducthe.backend.dto.response.FileUploadResponse;
import com.ducthe.backend.exception.BadRequestException;
import com.ducthe.backend.service.SpacesStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.net.URI;
import java.time.LocalDate;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class DigitalOceanSpacesStorageService implements SpacesStorageService {
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");

    private final String bucket;
    private final String publicEndpoint;
    private final S3Client s3Client;

    public DigitalOceanSpacesStorageService(
            @Value("${spaces.access-key}") String accessKey,
            @Value("${spaces.secret-key}") String secretKey,
            @Value("${spaces.bucket}") String bucket,
            @Value("${spaces.region}") String region,
            @Value("${spaces.endpoint}") String endpoint
    ) {
        this.bucket = bucket;
        this.publicEndpoint = stripTrailingSlash(endpoint);
        this.s3Client = S3Client.builder()
                .endpointOverride(URI.create(normalizeApiEndpoint(endpoint, bucket)))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey)))
                .build();
    }

    @Override
    public FileUploadResponse uploadProductImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui lòng chọn một ảnh để tải lên");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF");
        }

        String key = buildKey(file.getOriginalFilename());
        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(contentType)
                    .contentLength(file.getSize())
                    .acl(ObjectCannedACL.PUBLIC_READ)
                    .build();
            s3Client.putObject(request, RequestBody.fromBytes(file.getBytes()));
            return new FileUploadResponse(publicEndpoint + "/" + key, key, file.getOriginalFilename(), contentType, file.getSize());
        } catch (IOException ex) {
            throw new BadRequestException("Không thể đọc file ảnh tải lên");
        }
    }

    private String buildKey(String originalFilename) {
        String extension = "";
        String cleanedName = StringUtils.cleanPath(originalFilename == null ? "" : originalFilename);
        int dotIndex = cleanedName.lastIndexOf('.');
        if (dotIndex >= 0 && dotIndex < cleanedName.length() - 1) {
            extension = cleanedName.substring(dotIndex).toLowerCase(Locale.ROOT);
        }
        LocalDate today = LocalDate.now();
        return "products/%d/%02d/%s%s".formatted(today.getYear(), today.getMonthValue(), UUID.randomUUID(), extension);
    }

    private String normalizeApiEndpoint(String endpoint, String bucket) {
        URI uri = URI.create(stripTrailingSlash(endpoint));
        String host = uri.getHost();
        if (host != null && host.startsWith(bucket + ".")) {
            host = host.substring(bucket.length() + 1);
            return uri.getScheme() + "://" + host;
        }
        return uri.toString();
    }

    private String stripTrailingSlash(String value) {
        return value == null ? "" : value.replaceAll("/+$", "");
    }
}
