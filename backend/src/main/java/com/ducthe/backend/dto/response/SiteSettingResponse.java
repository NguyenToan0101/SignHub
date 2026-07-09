package com.ducthe.backend.dto.response;

import java.util.UUID;

public record SiteSettingResponse(
        UUID id,
        String hotline,
        String email,
        String address,
        String googleMapUrl,
        String facebookUrl,
        String zaloUrl,
        String messengerUrl,
        String whatsappUrl,
        String companyName,
        String taxCode,
        String footerDescription
) {
}
