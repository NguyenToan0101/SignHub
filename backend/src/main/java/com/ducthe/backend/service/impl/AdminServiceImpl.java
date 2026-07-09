package com.ducthe.backend.service.impl;

import com.ducthe.backend.dto.request.*;
import com.ducthe.backend.dto.response.*;
import com.ducthe.backend.entity.*;
import com.ducthe.backend.enums.OrderStatus;
import com.ducthe.backend.enums.ProductStatus;
import com.ducthe.backend.enums.RoleName;
import com.ducthe.backend.exception.BadRequestException;
import com.ducthe.backend.exception.ResourceNotFoundException;
import com.ducthe.backend.repository.*;
import com.ducthe.backend.security.JwtService;
import com.ducthe.backend.service.AdminService;
import com.ducthe.backend.service.MapperService;
import com.ducthe.backend.service.SlugService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AdminServiceImpl implements AdminService {
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BannerRepository bannerRepository;
    private final BlogPostRepository blogRepository;
    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;
    private final ContactMessageRepository contactRepository;
    private final SocialProofNotificationRepository socialProofRepository;
    private final MapperService mapper;
    private final SlugService slugService;

    public AdminServiceImpl(JwtService jwtService, PasswordEncoder passwordEncoder, UserRepository userRepository, ProductRepository productRepository, CategoryRepository categoryRepository, BannerRepository bannerRepository, BlogPostRepository blogRepository, CouponRepository couponRepository, OrderRepository orderRepository, ContactMessageRepository contactRepository, SocialProofNotificationRepository socialProofRepository, MapperService mapper, SlugService slugService) {
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.bannerRepository = bannerRepository;
        this.blogRepository = blogRepository;
        this.couponRepository = couponRepository;
        this.orderRepository = orderRepository;
        this.contactRepository = contactRepository;
        this.socialProofRepository = socialProofRepository;
        this.mapper = mapper;
        this.slugService = slugService;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        String password = request.password();

        if ("admin@gmail.com".equalsIgnoreCase(email) && "123".equals(password) && !userRepository.existsByEmailIgnoreCase(email)) {
            User admin = userRepository.findByEmail("admin@gmail.com")
                    .orElseGet(() -> User.builder()
                            .fullName("Admin")
                            .email("admin@gmail.com")
                            .phone("0900000000")
                            .build());
            admin.setPassword(passwordEncoder.encode("123"));
            admin.setRole(RoleName.ADMIN);
            admin.setEnabled(true);
            if (admin.getFullName() == null || admin.getFullName().isBlank()) {
                admin.setFullName("Admin");
            }
            userRepository.save(admin);
        }

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Email hoặc mật khẩu không đúng"));
        if (user.getRole() != RoleName.ADMIN || !passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Email hoặc mật khẩu không đúng");
        }
        String token = jwtService.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, "Bearer", user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    @Override
    public AuthResponse updateProfile(AdminProfileRequest request) {
        User user = currentUser();
        String nextEmail = request.email().trim().toLowerCase();
        userRepository.findByEmailIgnoreCase(nextEmail)
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new BadRequestException("Email is already used by another account");
                });
        user.setFullName(request.fullName().trim());
        user.setEmail(nextEmail);
        user.setPhone(request.phone() == null ? null : request.phone().trim());
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getEmail(), saved.getRole());
        return new AuthResponse(token, "Bearer", saved.getId(), saved.getFullName(), saved.getEmail(), saved.getRole().name());
    }

    @Override
    public void changePassword(PasswordChangeRequest request) {
        User user = currentUser();
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        if (request.newPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }

    @Override
    public Page<ProductResponse> products(int page, int size) {
        return productRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending())).map(mapper::toProduct);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        applyProduct(product, request);
        return mapper.toProduct(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(UUID id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.getImages().clear();
        product.getVariants().clear();
        applyProduct(product, request);
        return mapper.toProduct(productRepository.save(product));
    }

    @Override
    public void deleteProduct(UUID id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setStatus(ProductStatus.INACTIVE);
        productRepository.save(product);
    }

    @Override
    public List<CategoryResponse> categories() {
        return categoryRepository.findAll(Sort.by("name")).stream().map(mapper::toCategory).toList();
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {
        Category category = new Category();
        applyCategory(category, request);
        return mapper.toCategory(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(UUID id, CategoryRequest request) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        applyCategory(category, request);
        return mapper.toCategory(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(UUID id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Override
    public List<BannerResponse> banners() {
        return bannerRepository.findAll(Sort.by("sortOrder")).stream().map(mapper::toBanner).toList();
    }

    @Override
    public BannerResponse createBanner(BannerRequest request) {
        Banner banner = new Banner();
        applyBanner(banner, request);
        return mapper.toBanner(bannerRepository.save(banner));
    }

    @Override
    public BannerResponse updateBanner(UUID id, BannerRequest request) {
        Banner banner = bannerRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Banner not found"));
        applyBanner(banner, request);
        return mapper.toBanner(bannerRepository.save(banner));
    }

    @Override
    public void deleteBanner(UUID id) {
        bannerRepository.deleteById(id);
    }

    @Override
    public List<BlogPostResponse> blogs() {
        return blogRepository.findAll(Sort.by("createdAt").descending()).stream().map(mapper::toBlog).toList();
    }

    @Override
    public BlogPostResponse createBlog(BlogPostRequest request) {
        BlogPost blog = new BlogPost();
        applyBlog(blog, request);
        return mapper.toBlog(blogRepository.save(blog));
    }

    @Override
    public BlogPostResponse updateBlog(UUID id, BlogPostRequest request) {
        BlogPost blog = blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        applyBlog(blog, request);
        return mapper.toBlog(blogRepository.save(blog));
    }

    @Override
    public void deleteBlog(UUID id) {
        BlogPost blog = blogRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Blog not found"));
        blog.setPublished(false);
        blogRepository.save(blog);
    }

    @Override
    public List<CouponResponse> coupons() {
        return couponRepository.findAll().stream().map(mapper::toCoupon).toList();
    }

    @Override
    public CouponResponse createCoupon(CouponRequest request) {
        Coupon coupon = new Coupon();
        applyCoupon(coupon, request);
        return mapper.toCoupon(couponRepository.save(coupon));
    }

    @Override
    public CouponResponse updateCoupon(UUID id, CouponRequest request) {
        Coupon coupon = couponRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        applyCoupon(coupon, request);
        return mapper.toCoupon(couponRepository.save(coupon));
    }

    @Override
    public void deleteCoupon(UUID id) {
        couponRepository.deleteById(id);
    }

    @Override
    public Page<OrderResponse> orders(int page, int size) {
        return orderRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending())).map(mapper::toOrder);
    }

    @Override
    public OrderResponse order(UUID id) {
        return orderRepository.findById(id).map(mapper::toOrder).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public OrderResponse updateOrderStatus(UUID id, OrderStatus status) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setOrderStatus(status);
        return mapper.toOrder(orderRepository.save(order));
    }

    @Override
    public List<ContactMessageResponse> contactMessages() {
        return contactRepository.findAll(Sort.by("createdAt").descending()).stream().map(mapper::toContact).toList();
    }

    @Override
    public List<CustomerResponse> customers() {
        return userRepository.findByRoleOrderByCreatedAtDesc(RoleName.CUSTOMER).stream()
                .map(user -> new CustomerResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getPhone(),
                        user.isEnabled(),
                        user.getCreatedAt()
                ))
                .toList();
    }

    @Override
    public ContactMessageResponse markContactReply(UUID id, boolean replied) {
        ContactMessage contact = contactRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Contact message not found"));
        contact.setReplied(replied);
        return mapper.toContact(contactRepository.save(contact));
    }

    @Override
    public List<SocialProofResponse> socialProofs() {
        return socialProofRepository.findAll().stream().map(mapper::toSocialProof).toList();
    }

    @Override
    public SocialProofResponse createSocialProof(SocialProofRequest request) {
        SocialProofNotification item = new SocialProofNotification();
        applySocialProof(item, request);
        return mapper.toSocialProof(socialProofRepository.save(item));
    }

    @Override
    public SocialProofResponse updateSocialProof(UUID id, SocialProofRequest request) {
        SocialProofNotification item = socialProofRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Social proof not found"));
        applySocialProof(item, request);
        return mapper.toSocialProof(socialProofRepository.save(item));
    }

    @Override
    public void deleteSocialProof(UUID id) {
        socialProofRepository.deleteById(id);
    }

    @Override
    public DashboardResponse dashboard() {
        BigDecimal revenue = orderRepository.findAll().stream()
                .filter(order -> order.getOrderStatus() == OrderStatus.COMPLETED)
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new DashboardResponse(productRepository.count(), orderRepository.count(), contactRepository.count(), revenue);
    }

    private void applyProduct(Product product, ProductRequest request) {
        product.setName(request.name());
        product.setSlug(request.slug() == null || request.slug().isBlank() ? slugService.slug(request.name()) : request.slug());
        product.setCode(request.code());
        product.setShortDescription(request.shortDescription());
        product.setDescription(request.description());
        product.setMaterial(request.material());
        product.setThickness(request.thickness());
        product.setWeight(request.weight());
        product.setBasePrice(request.basePrice());
        product.setStatus(request.status() == null ? ProductStatus.ACTIVE : request.status());
        product.setFeatured(Boolean.TRUE.equals(request.featured()));
        product.setCategory(request.categoryId() == null ? null : categoryRepository.findById(request.categoryId()).orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        if (request.images() != null) {
            for (ProductImageRequest imageRequest : request.images()) {
                ProductImage image = ProductImage.builder().product(product).imageUrl(imageRequest.imageUrl()).mainImage(Boolean.TRUE.equals(imageRequest.mainImage())).sortOrder(imageRequest.sortOrder() == null ? 0 : imageRequest.sortOrder()).build();
                product.getImages().add(image);
            }
        }
        if (request.variants() != null) {
            for (ProductVariantRequest variantRequest : request.variants()) {
                ProductVariant variant = ProductVariant.builder().product(product).size(variantRequest.size()).extraPrice(variantRequest.extraPrice()).stockQuantity(variantRequest.stockQuantity() == null ? 0 : variantRequest.stockQuantity()).active(!Boolean.FALSE.equals(variantRequest.active())).build();
                product.getVariants().add(variant);
            }
        }
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("Admin user not found"));
    }

    private void applyCategory(Category category, CategoryRequest request) {
        category.setName(request.name());
        category.setSlug(request.slug() == null || request.slug().isBlank() ? slugService.slug(request.name()) : request.slug());
        category.setDescription(request.description());
        category.setImageUrl(request.imageUrl());
        category.setActive(!Boolean.FALSE.equals(request.active()));
        category.setParentCategory(request.parentCategoryId() == null ? null : categoryRepository.findById(request.parentCategoryId()).orElseThrow(() -> new ResourceNotFoundException("Parent category not found")));
    }

    private void applyBanner(Banner banner, BannerRequest request) {
        banner.setTitle(request.title());
        banner.setSubtitle(request.subtitle());
        banner.setImageUrl(request.imageUrl());
        banner.setLinkUrl(request.linkUrl());
        banner.setActive(!Boolean.FALSE.equals(request.active()));
        banner.setSortOrder(request.sortOrder() == null ? 0 : request.sortOrder());
    }

    private void applyBlog(BlogPost blog, BlogPostRequest request) {
        blog.setTitle(request.title());
        blog.setSlug(request.slug() == null || request.slug().isBlank() ? slugService.slug(request.title()) : request.slug());
        blog.setThumbnailUrl(request.thumbnailUrl());
        blog.setSummary(request.summary());
        blog.setContent(request.content());
        blog.setPublished(!Boolean.FALSE.equals(request.published()));
    }

    private void applyCoupon(Coupon coupon, CouponRequest request) {
        coupon.setCode(request.code().toUpperCase());
        coupon.setDescription(request.description());
        coupon.setDiscountType(request.discountType());
        coupon.setDiscountValue(request.discountValue());
        coupon.setMaxDiscountAmount(request.maxDiscountAmount());
        coupon.setMinOrderAmount(request.minOrderAmount());
        coupon.setUsageLimit(request.usageLimit());
        coupon.setStartDate(request.startDate());
        coupon.setEndDate(request.endDate());
        coupon.setActive(!Boolean.FALSE.equals(request.active()));
    }

    private void applySocialProof(SocialProofNotification item, SocialProofRequest request) {
        item.setCustomerName(request.customerName());
        item.setProductName(request.productName());
        item.setMessage(request.message());
        item.setMinutesAgo(request.minutesAgo() == null ? 3 : request.minutesAgo());
        item.setActive(!Boolean.FALSE.equals(request.active()));
    }
}
