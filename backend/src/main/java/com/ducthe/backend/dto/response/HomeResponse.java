package com.ducthe.backend.dto.response;

import java.util.List;

public record HomeResponse(
        List<BannerResponse> banners,
        List<CategoryResponse> categories,
        List<ProductResponse> featuredProducts,
        List<ReviewResponse> reviews,
        List<BlogPostResponse> latestBlogs,
        List<SocialProofResponse> socialProofNotifications,
        SiteSettingResponse siteSetting
) {
}
