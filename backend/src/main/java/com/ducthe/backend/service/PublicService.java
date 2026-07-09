package com.ducthe.backend.service;

import com.ducthe.backend.dto.request.ContactRequest;
import com.ducthe.backend.dto.response.*;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface PublicService {
    HomeResponse home();
    List<CategoryResponse> categories();
    Page<ProductResponse> products(String keyword, String categorySlug, BigDecimal minPrice, BigDecimal maxPrice, String sort, int page, int size);
    ProductResponse product(String slug);
    List<ProductResponse> relatedProducts(String slug);
    List<BlogPostResponse> blogs();
    BlogPostResponse blog(String slug);
    ContactMessageResponse contact(ContactRequest request);
    SiteSettingResponse siteSettings();
    List<SocialProofResponse> socialProof();
}
