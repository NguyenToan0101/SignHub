package com.ducthe.backend.repository;

import com.ducthe.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findTop8ByVisibleTrueOrderByCreatedAtDesc();
    List<Review> findByProductSlugAndVisibleTrueOrderByCreatedAtDesc(String slug);
}
