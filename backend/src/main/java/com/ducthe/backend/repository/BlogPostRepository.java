package com.ducthe.backend.repository;

import com.ducthe.backend.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BlogPostRepository extends JpaRepository<BlogPost, UUID> {
    List<BlogPost> findTop6ByPublishedTrueOrderByCreatedAtDesc();
    List<BlogPost> findByPublishedTrueOrderByCreatedAtDesc();
    Optional<BlogPost> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
