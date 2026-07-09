package com.ducthe.backend.controller;

import com.ducthe.backend.dto.request.*;
import com.ducthe.backend.dto.response.*;
import com.ducthe.backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;
    private final com.ducthe.backend.service.SpacesStorageService spacesStorageService;

    public AdminController(AdminService adminService, com.ducthe.backend.service.SpacesStorageService spacesStorageService) {
        this.adminService = adminService;
        this.spacesStorageService = spacesStorageService;
    }

    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return adminService.login(request);
    }

    @PutMapping("/profile")
    public AuthResponse updateProfile(@Valid @RequestBody AdminProfileRequest request) {
        return adminService.updateProfile(request);
    }

    @PutMapping("/profile/password")
    public void changePassword(@Valid @RequestBody PasswordChangeRequest request) {
        adminService.changePassword(request);
    }

    @GetMapping("/products")
    public Page<ProductResponse> products(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return adminService.products(page, size);
    }

    @PostMapping("/products")
    public ProductResponse createProduct(@Valid @RequestBody ProductRequest request) {
        return adminService.createProduct(request);
    }

    @PutMapping("/products/{id}")
    public ProductResponse updateProduct(@PathVariable UUID id, @Valid @RequestBody ProductRequest request) {
        return adminService.updateProduct(id, request);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(@PathVariable UUID id) {
        adminService.deleteProduct(id);
    }

    @PostMapping(value = "/uploads/product-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileUploadResponse uploadProductImage(@RequestPart("file") MultipartFile file) {
        return spacesStorageService.uploadProductImage(file);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return adminService.categories();
    }

    @PostMapping("/categories")
    public CategoryResponse createCategory(@Valid @RequestBody CategoryRequest request) {
        return adminService.createCategory(request);
    }

    @PutMapping("/categories/{id}")
    public CategoryResponse updateCategory(@PathVariable UUID id, @Valid @RequestBody CategoryRequest request) {
        return adminService.updateCategory(id, request);
    }

    @DeleteMapping("/categories/{id}")
    public void deleteCategory(@PathVariable UUID id) {
        adminService.deleteCategory(id);
    }

    @GetMapping("/banners")
    public List<BannerResponse> banners() {
        return adminService.banners();
    }

    @PostMapping("/banners")
    public BannerResponse createBanner(@Valid @RequestBody BannerRequest request) {
        return adminService.createBanner(request);
    }

    @PutMapping("/banners/{id}")
    public BannerResponse updateBanner(@PathVariable UUID id, @Valid @RequestBody BannerRequest request) {
        return adminService.updateBanner(id, request);
    }

    @DeleteMapping("/banners/{id}")
    public void deleteBanner(@PathVariable UUID id) {
        adminService.deleteBanner(id);
    }

    @GetMapping("/blogs")
    public List<BlogPostResponse> blogs() {
        return adminService.blogs();
    }

    @PostMapping("/blogs")
    public BlogPostResponse createBlog(@Valid @RequestBody BlogPostRequest request) {
        return adminService.createBlog(request);
    }

    @PutMapping("/blogs/{id}")
    public BlogPostResponse updateBlog(@PathVariable UUID id, @Valid @RequestBody BlogPostRequest request) {
        return adminService.updateBlog(id, request);
    }

    @DeleteMapping("/blogs/{id}")
    public void deleteBlog(@PathVariable UUID id) {
        adminService.deleteBlog(id);
    }

    @GetMapping("/coupons")
    public List<CouponResponse> coupons() {
        return adminService.coupons();
    }

    @PostMapping("/coupons")
    public CouponResponse createCoupon(@Valid @RequestBody CouponRequest request) {
        return adminService.createCoupon(request);
    }

    @PutMapping("/coupons/{id}")
    public CouponResponse updateCoupon(@PathVariable UUID id, @Valid @RequestBody CouponRequest request) {
        return adminService.updateCoupon(id, request);
    }

    @DeleteMapping("/coupons/{id}")
    public void deleteCoupon(@PathVariable UUID id) {
        adminService.deleteCoupon(id);
    }

    @GetMapping("/orders")
    public Page<OrderResponse> orders(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {
        return adminService.orders(page, size);
    }

    @GetMapping("/orders/{id}")
    public OrderResponse order(@PathVariable UUID id) {
        return adminService.order(id);
    }

    @PutMapping("/orders/{id}/status")
    public OrderResponse updateOrderStatus(@PathVariable UUID id, @Valid @RequestBody OrderStatusUpdateRequest request) {
        return adminService.updateOrderStatus(id, request.status());
    }

    @GetMapping("/contact-messages")
    public List<ContactMessageResponse> contactMessages() {
        return adminService.contactMessages();
    }

    @GetMapping("/customers")
    public List<CustomerResponse> customers() {
        return adminService.customers();
    }

    @PutMapping("/contact-messages/{id}/reply")
    public ContactMessageResponse markReply(@PathVariable UUID id, @RequestBody ReplyRequest request) {
        return adminService.markContactReply(id, request.replied() == null || request.replied());
    }

    @GetMapping("/social-proof")
    public List<SocialProofResponse> socialProofs() {
        return adminService.socialProofs();
    }

    @PostMapping("/social-proof")
    public SocialProofResponse createSocialProof(@Valid @RequestBody SocialProofRequest request) {
        return adminService.createSocialProof(request);
    }

    @PutMapping("/social-proof/{id}")
    public SocialProofResponse updateSocialProof(@PathVariable UUID id, @Valid @RequestBody SocialProofRequest request) {
        return adminService.updateSocialProof(id, request);
    }

    @DeleteMapping("/social-proof/{id}")
    public void deleteSocialProof(@PathVariable UUID id) {
        adminService.deleteSocialProof(id);
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {
        return adminService.dashboard();
    }
}
