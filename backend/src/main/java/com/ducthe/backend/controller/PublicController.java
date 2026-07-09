package com.ducthe.backend.controller;

import com.ducthe.backend.dto.request.ContactRequest;
import com.ducthe.backend.dto.response.*;
import com.ducthe.backend.service.PublicService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    private final PublicService publicService;

    public PublicController(PublicService publicService) {
        this.publicService = publicService;
    }

    @GetMapping("/home")
    public HomeResponse home() {
        return publicService.home();
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return publicService.categories();
    }

    @GetMapping("/products")
    public Page<ProductResponse> products(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "newest") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return publicService.products(keyword, category, minPrice, maxPrice, sort, page, size);
    }

    @GetMapping("/products/{slug}")
    public ProductResponse product(@PathVariable String slug) {
        return publicService.product(slug);
    }

    @GetMapping("/products/{slug}/related")
    public List<ProductResponse> related(@PathVariable String slug) {
        return publicService.relatedProducts(slug);
    }

    @GetMapping("/blogs")
    public List<BlogPostResponse> blogs() {
        return publicService.blogs();
    }

    @GetMapping("/blogs/{slug}")
    public BlogPostResponse blog(@PathVariable String slug) {
        return publicService.blog(slug);
    }

    @PostMapping("/contact")
    public ContactMessageResponse contact(@Valid @RequestBody ContactRequest request) {
        return publicService.contact(request);
    }

    @GetMapping("/site-settings")
    public SiteSettingResponse siteSettings() {
        return publicService.siteSettings();
    }

    @GetMapping("/social-proof")
    public List<SocialProofResponse> socialProof() {
        return publicService.socialProof();
    }
}
