package com.ducthe.backend.config;

import com.ducthe.backend.entity.*;
import com.ducthe.backend.enums.DiscountType;
import com.ducthe.backend.enums.ProductStatus;
import com.ducthe.backend.enums.RoleName;
import com.ducthe.backend.repository.*;
import com.ducthe.backend.service.SlugService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seed(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            BannerRepository bannerRepository,
            BlogPostRepository blogRepository,
            ReviewRepository reviewRepository,
            CouponRepository couponRepository,
            SiteSettingRepository siteSettingRepository,
            SocialProofNotificationRepository socialProofRepository,
            PasswordEncoder passwordEncoder,
            SlugService slugService
    ) {
        return args -> {
            boolean adminExists = userRepository.existsByEmailIgnoreCase("admin@gmail.com");
            User admin = userRepository.findByEmail("admin@gmail.com")
                    .orElseGet(() -> User.builder()
                            .fullName("Admin")
                            .email("admin@gmail.com")
                            .phone("0900000000")
                            .build());
            admin.setFullName(admin.getFullName() == null || admin.getFullName().isBlank() ? "Admin" : admin.getFullName());
            if (!adminExists || admin.getPassword() == null || admin.getPassword().isBlank()) {
                admin.setPassword(passwordEncoder.encode("123"));
            }
            admin.setPhone(admin.getPhone() == null || admin.getPhone().isBlank() ? "0900000000" : admin.getPhone());
            admin.setRole(RoleName.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);

            Category houseNumber = categoryRepository.findBySlug("bien-so-nha").orElseGet(() -> categoryRepository.save(Category.builder()
                    .name("Biển số nhà")
                    .slug("bien-so-nha")
                    .description("Biển số nhà mica, inox, alu thiết kế theo yêu cầu.")
                    .imageUrl("/images/categories/bien-so-nha.jpg")
                    .active(true)
                    .build()));

            Category companySign = categoryRepository.findBySlug("bien-cong-ty").orElseGet(() -> categoryRepository.save(Category.builder()
                    .name("Biển công ty")
                    .slug("bien-cong-ty")
                    .description("Biển tên công ty, bảng phòng ban và bảng thông tin.")
                    .imageUrl("/images/categories/bien-cong-ty.jpg")
                    .active(true)
                    .build()));

            if (productRepository.count() == 0) {
                seedProduct(productRepository, reviewRepository, houseNumber, "Biển số nhà mica đen viền vàng", "BSN-PMV421", new BigDecimal("280000"), true, slugService);
                seedProduct(productRepository, reviewRepository, houseNumber, "Biển số nhà inox gương cao cấp", "BSN-PMV422", new BigDecimal("420000"), true, slugService);
                seedProduct(productRepository, reviewRepository, companySign, "Biển tên công ty alu phủ UV", "BCY-PMV101", new BigDecimal("650000"), false, slugService);
            }

            if (bannerRepository.count() == 0) {
                bannerRepository.saveAll(List.of(
                        Banner.builder()
                                .title("Biển số nhà thiết kế riêng")
                                .subtitle("Gia công theo kích thước, màu sắc và chất liệu bạn chọn")
                                .imageUrl("/images/banners/bien-so-nha.jpg")
                                .linkUrl("/products?category=bien-so-nha")
                                .active(true)
                                .sortOrder(1)
                                .build(),
                        Banner.builder()
                                .title("Ưu đãi khai trương")
                                .subtitle("Miễn phí thiết kế mockup cho đơn đầu tiên")
                                .imageUrl("/images/banners/uu-dai.jpg")
                                .linkUrl("/products")
                                .active(true)
                                .sortOrder(2)
                                .build()
                ));
            }

            if (blogRepository.count() == 0) {
                blogRepository.save(BlogPost.builder()
                        .title("Cách chọn kích thước biển số nhà phù hợp")
                        .slug("cach-chon-kich-thuoc-bien-so-nha")
                        .thumbnailUrl("/images/blogs/kich-thuoc-bien-so-nha.jpg")
                        .summary("Gợi ý nhanh để biển số nhà dễ nhìn, cân đối với mặt tiền.")
                        .content("Nên chọn kích thước dựa trên khoảng cách quan sát, màu nền tường và phong cách mặt tiền.")
                        .published(true)
                        .build());
            }

            if (couponRepository.count() == 0) {
                couponRepository.save(Coupon.builder()
                        .code("PMV10")
                        .description("Giảm 10% cho đơn từ 500.000đ")
                        .discountType(DiscountType.PERCENTAGE)
                        .discountValue(new BigDecimal("10"))
                        .maxDiscountAmount(new BigDecimal("100000"))
                        .minOrderAmount(new BigDecimal("500000"))
                        .usageLimit(200)
                        .startDate(LocalDateTime.now().minusDays(1))
                        .endDate(LocalDateTime.now().plusMonths(3))
                        .active(true)
                        .build());
            }

            if (siteSettingRepository.count() == 0) {
                siteSettingRepository.save(SiteSetting.builder()
                        .companyName("SignHub")
                        .hotline("0900 000 000")
                        .email("contact@signhub.vn")
                        .address("TP. Hồ Chí Minh")
                        .facebookUrl("https://facebook.com/signhub")
                        .zaloUrl("https://zalo.me/0900000000")
                        .footerDescription("SignHub chuyên thiết kế và gia công biển số nhà, biển công ty theo yêu cầu.")
                        .build());
            }

            if (socialProofRepository.count() == 0) {
                socialProofRepository.saveAll(List.of(
                        SocialProofNotification.builder()
                                .customerName("Nguyễn Văn A")
                                .productName("Biển số nhà mica đen viền vàng")
                                .message("Nguyễn Văn A vừa đặt biển số nhà")
                                .minutesAgo(3)
                                .active(true)
                                .build(),
                        SocialProofNotification.builder()
                                .customerName("Trần Thị B")
                                .productName("Biển số nhà inox gương cao cấp")
                                .message("Trần Thị B vừa đặt biển số nhà")
                                .minutesAgo(7)
                                .active(true)
                                .build()
                ));
            }
        };
    }

    private void seedProduct(ProductRepository productRepository, ReviewRepository reviewRepository, Category category, String name, String code, BigDecimal price, boolean featured, SlugService slugService) {
        Product product = Product.builder()
                .name(name)
                .slug(slugService.slug(name))
                .code(code)
                .shortDescription("Biển số nhà gia công sắc nét, phù hợp nhà phố và căn hộ.")
                .description("Sản phẩm được thiết kế theo yêu cầu, hỗ trợ đổi nội dung số nhà trước khi sản xuất.")
                .material("Mica/Inox/Alu")
                .thickness("3mm - 5mm")
                .weight("0.4kg")
                .basePrice(price)
                .status(ProductStatus.ACTIVE)
                .featured(featured)
                .category(category)
                .build();

        product.getImages().add(ProductImage.builder()
                .product(product)
                .imageUrl("/images/products/" + product.getSlug() + "-1.jpg")
                .mainImage(true)
                .sortOrder(1)
                .build());
        product.getVariants().add(ProductVariant.builder().product(product).size("25x17.5cm").extraPrice(price).stockQuantity(50).active(true).build());
        product.getVariants().add(ProductVariant.builder().product(product).size("30x21cm").extraPrice(price.add(new BigDecimal("50000"))).stockQuantity(50).active(true).build());
        product.getVariants().add(ProductVariant.builder().product(product).size("35x24.5cm").extraPrice(price.add(new BigDecimal("90000"))).stockQuantity(50).active(true).build());

        Product saved = productRepository.save(product);
        reviewRepository.save(Review.builder()
                .product(saved)
                .customerName("Khách hàng SignHub")
                .rating(5)
                .content("Biển số nhà đẹp, tư vấn nhanh và giao đúng mẫu đã duyệt.")
                .visible(true)
                .build());
    }
}
