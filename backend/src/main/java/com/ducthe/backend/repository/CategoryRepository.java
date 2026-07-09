package com.ducthe.backend.repository;

import com.ducthe.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
    List<Category> findByActiveTrueOrderByNameAsc();
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);
}
