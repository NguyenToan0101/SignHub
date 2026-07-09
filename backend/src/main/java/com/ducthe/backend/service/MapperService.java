package com.ducthe.backend.service;

import com.ducthe.backend.dto.response.*;
import com.ducthe.backend.entity.*;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;

@Component
public class MapperService {
    public CategoryResponse toCategory(Category category) {
        if (category == null) return null;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getImageUrl(),
                category.getParentCategory() == null ? null : category.getParentCategory().getId(),
                category.isActive()
        );
    }

    public ProductResponse toProduct(Product product) {
        return toProduct(product, List.of());
    }

    public ProductResponse toProduct(Product product, List<Review> reviews) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getSlug(),
                product.getCode(),
                product.getShortDescription(),
                product.getDescription(),
                product.getMaterial(),
                product.getThickness(),
                product.getWeight(),
                product.getBasePrice(),
                product.getStatus(),
                product.isFeatured(),
                product.getSoldCount(),
                toCategory(product.getCategory()),
                product.getImages().stream().sorted(Comparator.comparingInt(ProductImage::getSortOrder)).map(this::toImage).toList(),
                product.getVariants().stream().map(this::toVariant).toList(),
                reviews.stream().map(this::toReview).toList(),
                product.getCreatedAt()
        );
    }

    public ProductImageResponse toImage(ProductImage image) {
        return new ProductImageResponse(image.getId(), image.getImageUrl(), image.isMainImage(), image.getSortOrder());
    }

    public ProductVariantResponse toVariant(ProductVariant variant) {
        return new ProductVariantResponse(variant.getId(), variant.getSize(), variant.getExtraPrice(), variant.getStockQuantity(), variant.isActive());
    }

    public ReviewResponse toReview(Review review) {
        return new ReviewResponse(review.getId(), review.getCustomerName(), review.getRating(), review.getContent(), review.getCreatedAt());
    }

    public BannerResponse toBanner(Banner banner) {
        return new BannerResponse(banner.getId(), banner.getTitle(), banner.getSubtitle(), banner.getImageUrl(), banner.getLinkUrl(), banner.isActive(), banner.getSortOrder());
    }

    public BlogPostResponse toBlog(BlogPost blog) {
        return new BlogPostResponse(blog.getId(), blog.getTitle(), blog.getSlug(), blog.getThumbnailUrl(), blog.getSummary(), blog.getContent(), blog.isPublished(), blog.getCreatedAt(), blog.getUpdatedAt());
    }

    public ContactMessageResponse toContact(ContactMessage contact) {
        return new ContactMessageResponse(contact.getId(), contact.getFullName(), contact.getEmail(), contact.getPhone(), contact.getMessage(), contact.isReplied(), contact.getCreatedAt());
    }

    public SocialProofResponse toSocialProof(SocialProofNotification item) {
        return new SocialProofResponse(item.getId(), item.getCustomerName(), item.getProductName(), item.getMessage(), item.getMinutesAgo(), item.isActive());
    }

    public SiteSettingResponse toSiteSetting(SiteSetting setting) {
        if (setting == null) return null;
        return new SiteSettingResponse(setting.getId(), setting.getHotline(), setting.getEmail(), setting.getAddress(), setting.getGoogleMapUrl(), setting.getFacebookUrl(), setting.getZaloUrl(), setting.getMessengerUrl(), setting.getWhatsappUrl(), setting.getCompanyName(), setting.getTaxCode(), setting.getFooterDescription());
    }

    public CartResponse toCart(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream().map(this::toCartItem).toList();
        BigDecimal subtotal = items.stream().map(CartItemResponse::totalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(cart.getId(), cart.getSessionId(), items, subtotal);
    }

    public CartItemResponse toCartItem(CartItem item) {
        return new CartItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getSlug(),
                item.getProduct().getCode(),
                thumbnail(item.getProduct()),
                item.getVariant() == null ? null : item.getVariant().getId(),
                item.getVariant() == null ? null : item.getVariant().getSize(),
                item.getQuantity(),
                item.getUnitPrice(),
                item.getTotalPrice()
        );
    }

    public AddressResponse toAddress(Address address) {
        if (address == null) return null;
        return new AddressResponse(address.getId(), address.getFullName(), address.getPhone(), address.getEmail(), address.getProvince(), address.getDistrict(), address.getWard(), address.getDetailAddress());
    }

    public CouponResponse toCoupon(Coupon coupon) {
        return new CouponResponse(coupon.getId(), coupon.getCode(), coupon.getDescription(), coupon.getDiscountType(), coupon.getDiscountValue(), coupon.getMaxDiscountAmount(), coupon.getMinOrderAmount(), coupon.getUsageLimit(), coupon.getUsedCount(), coupon.getStartDate(), coupon.getEndDate(), coupon.isActive());
    }

    public OrderResponse toOrder(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getOrderCode(),
                toAddress(order.getBillingAddress()),
                toAddress(order.getShippingAddress()),
                order.isShipToDifferentAddress(),
                order.getNote(),
                order.getSubtotal(),
                order.getShippingFee(),
                order.getDiscountAmount(),
                order.getTotalAmount(),
                order.getPaymentMethod(),
                order.getPaymentStatus(),
                order.getOrderStatus(),
                order.getCoupon() == null ? null : order.getCoupon().getCode(),
                order.getItems().stream().map(this::toOrderItem).toList(),
                order.getCreatedAt()
        );
    }

    public OrderItemResponse toOrderItem(OrderItem item) {
        return new OrderItemResponse(item.getId(), item.getProductId(), item.getProductName(), item.getProductCode(), item.getVariantSize(), item.getQuantity(), item.getUnitPrice(), item.getTotalPrice(), item.getThumbnailUrl());
    }

    public String thumbnail(Product product) {
        return product.getImages().stream()
                .sorted(Comparator.comparing(ProductImage::isMainImage).reversed().thenComparingInt(ProductImage::getSortOrder))
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(null);
    }
}
