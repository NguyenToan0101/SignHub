package com.ducthe.backend.service;

import com.ducthe.backend.dto.request.*;
import com.ducthe.backend.dto.response.*;
import com.ducthe.backend.enums.OrderStatus;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.UUID;

public interface AdminService {
    AuthResponse login(LoginRequest request);
    AuthResponse updateProfile(AdminProfileRequest request);
    void changePassword(PasswordChangeRequest request);
    Page<ProductResponse> products(int page, int size);
    ProductResponse createProduct(ProductRequest request);
    ProductResponse updateProduct(UUID id, ProductRequest request);
    void deleteProduct(UUID id);
    List<CategoryResponse> categories();
    CategoryResponse createCategory(CategoryRequest request);
    CategoryResponse updateCategory(UUID id, CategoryRequest request);
    void deleteCategory(UUID id);
    List<BannerResponse> banners();
    BannerResponse createBanner(BannerRequest request);
    BannerResponse updateBanner(UUID id, BannerRequest request);
    void deleteBanner(UUID id);
    List<BlogPostResponse> blogs();
    BlogPostResponse createBlog(BlogPostRequest request);
    BlogPostResponse updateBlog(UUID id, BlogPostRequest request);
    void deleteBlog(UUID id);
    List<CouponResponse> coupons();
    CouponResponse createCoupon(CouponRequest request);
    CouponResponse updateCoupon(UUID id, CouponRequest request);
    void deleteCoupon(UUID id);
    Page<OrderResponse> orders(int page, int size);
    OrderResponse order(UUID id);
    OrderResponse updateOrderStatus(UUID id, OrderStatus status);
    List<ContactMessageResponse> contactMessages();
    List<CustomerResponse> customers();
    ContactMessageResponse markContactReply(UUID id, boolean replied);
    List<SocialProofResponse> socialProofs();
    SocialProofResponse createSocialProof(SocialProofRequest request);
    SocialProofResponse updateSocialProof(UUID id, SocialProofRequest request);
    void deleteSocialProof(UUID id);
    DashboardResponse dashboard();
}
