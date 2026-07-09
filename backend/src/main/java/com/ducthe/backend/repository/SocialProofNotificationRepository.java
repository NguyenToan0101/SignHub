package com.ducthe.backend.repository;

import com.ducthe.backend.entity.SocialProofNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface SocialProofNotificationRepository extends JpaRepository<SocialProofNotification, UUID> {
    List<SocialProofNotification> findByActiveTrue();
}
