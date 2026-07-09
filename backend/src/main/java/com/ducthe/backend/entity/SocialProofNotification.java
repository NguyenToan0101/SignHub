package com.ducthe.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "social_proof_notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SocialProofNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String customerName;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    @Builder.Default
    private int minutesAgo = 3;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
