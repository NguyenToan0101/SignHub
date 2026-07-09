package com.ducthe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "site_settings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SiteSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String hotline;
    private String email;
    private String address;
    private String googleMapUrl;
    private String facebookUrl;
    private String zaloUrl;
    private String messengerUrl;
    private String whatsappUrl;
    private String companyName;
    private String taxCode;

    @Column(columnDefinition = "TEXT")
    private String footerDescription;
}
