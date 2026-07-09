package com.ducthe.backend.repository;

import com.ducthe.backend.entity.SiteSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SiteSettingRepository extends JpaRepository<SiteSetting, UUID> {
}
