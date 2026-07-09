package com.ducthe.backend.repository;

import com.ducthe.backend.entity.Product;
import com.ducthe.backend.enums.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);
    boolean existsBySlug(String slug);
    boolean existsByCode(String code);
    Page<Product> findByStatus(ProductStatus status, Pageable pageable);
    List<Product> findTop8ByStatusAndFeaturedTrueOrderByCreatedAtDesc(ProductStatus status);
    List<Product> findTop8ByCategoryIdAndStatusAndIdNotOrderByCreatedAtDesc(UUID categoryId, ProductStatus status, UUID id);
}
