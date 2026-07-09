package com.ducthe.backend.dto.response;

import java.util.UUID;

public record AddressResponse(UUID id, String fullName, String phone, String email, String province, String district, String ward, String detailAddress) {
}
