package com.ducthe.backend.service.impl;

import com.ducthe.backend.dto.request.ContactRequest;
import com.ducthe.backend.dto.response.*;
import com.ducthe.backend.entity.BlogPost;
import com.ducthe.backend.entity.ContactMessage;
import com.ducthe.backend.entity.Product;
import com.ducthe.backend.enums.ProductStatus;
import com.ducthe.backend.exception.ResourceNotFoundException;
import com.ducthe.backend.repository.*;
import com.ducthe.backend.service.MapperService;
import com.ducthe.backend.service.PublicService;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class PublicServiceImpl implements PublicService {
    private final BannerRepository bannerRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ReviewRepository reviewRepository;
    private final BlogPostRepository blogPostRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final SiteSettingRepository siteSettingRepository;
    private final SocialProofNotificationRepository socialProofRepository;
    private final MapperService mapper;

    public PublicServiceImpl(BannerRepository bannerRepository, CategoryRepository categoryRepository, ProductRepository productRepository, ReviewRepository reviewRepository, BlogPostRepository blogPostRepository, ContactMessageRepository contactMessageRepository, SiteSettingRepository siteSettingRepository, SocialProofNotificationRepository socialProofRepository, MapperService mapper) {
        this.bannerRepository = bannerRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.reviewRepository = reviewRepository;
        this.blogPostRepository = blogPostRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.siteSettingRepository = siteSettingRepository;
        this.socialProofRepository = socialProofRepository;
        this.mapper = mapper;
    }

    @Override
    public HomeResponse home() {
        return new HomeResponse(
                bannerRepository.findByActiveTrueOrderBySortOrderAsc().stream().map(mapper::toBanner).toList(),
                categoryRepository.findByActiveTrueOrderByNameAsc().stream().map(mapper::toCategory).toList(),
                productRepository.findTop8ByStatusAndFeaturedTrueOrderByCreatedAtDesc(ProductStatus.ACTIVE).stream().map(mapper::toProduct).toList(),
                reviewRepository.findTop8ByVisibleTrueOrderByCreatedAtDesc().stream().map(mapper::toReview).toList(),
                blogPostRepository.findTop6ByPublishedTrueOrderByCreatedAtDesc().stream().map(mapper::toBlog).toList(),
                socialProof(),
                siteSettings()
        );
    }

    @Override
    public List<CategoryResponse> categories() {
        return categoryRepository.findByActiveTrueOrderByNameAsc().stream().map(mapper::toCategory).toList();
    }

    @Override
    public Page<ProductResponse> products(String keyword, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice, String sort, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, sort(sort));
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), ProductStatus.ACTIVE));
            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(cb.like(cb.lower(root.get("name")), pattern), cb.like(cb.lower(root.get("code")), pattern)));
            }
            if (categorySlug != null && !categorySlug.isBlank()) {
                predicates.add(cb.equal(root.join("category").get("slug"), categorySlug));
            }
            if (minPrice != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), minPrice));
            }
            if (maxPrice != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), maxPrice));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
        return productRepository.findAll(spec, pageable).map(mapper::toProduct);
    }

    @Override
    public ProductResponse product(String slug) {
        Product product = productRepository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapper.toProduct(product, reviewRepository.findByProductSlugAndVisibleTrueOrderByCreatedAtDesc(slug));
    }

    @Override
    public List<ProductResponse> relatedProducts(String slug) {
        Product product = productRepository.findBySlug(slug).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (product.getCategory() == null) {
            return List.of();
        }
        return productRepository.findTop8ByCategoryIdAndStatusAndIdNotOrderByCreatedAtDesc(product.getCategory().getId(), ProductStatus.ACTIVE, product.getId()).stream().map(mapper::toProduct).toList();
    }

    @Override
    public List<BlogPostResponse> blogs() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc().stream().map(mapper::toBlog).toList();
    }

    @Override
    public BlogPostResponse blog(String slug) {
        return blogPostRepository.findBySlug(slug).filter(BlogPost::isPublished).map(mapper::toBlog).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
    }

    @Override
    public ContactMessageResponse contact(ContactRequest request) {
        ContactMessage saved = contactMessageRepository.save(ContactMessage.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .message(request.message())
                .build());
        return mapper.toContact(saved);
    }

    @Override
    public SiteSettingResponse siteSettings() {
        return siteSettingRepository.findAll().stream().findFirst().map(mapper::toSiteSetting).orElse(null);
    }

    @Override
    public List<SocialProofResponse> socialProof() {
        return socialProofRepository.findByActiveTrue().stream().map(mapper::toSocialProof).toList();
    }

    private Sort sort(String sort) {
        return switch (sort == null ? "newest" : sort) {
            case "price_asc" -> Sort.by("basePrice").ascending();
            case "price_desc" -> Sort.by("basePrice").descending();
            case "best_selling" -> Sort.by("soldCount").descending();
            default -> Sort.by("createdAt").descending();
        };
    }
}
