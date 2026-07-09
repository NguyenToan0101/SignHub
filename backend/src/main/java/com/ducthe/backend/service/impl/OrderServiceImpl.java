package com.ducthe.backend.service.impl;

import com.ducthe.backend.dto.request.AddressRequest;
import com.ducthe.backend.dto.request.CouponApplyRequest;
import com.ducthe.backend.dto.request.OrderRequest;
import com.ducthe.backend.dto.response.CouponApplyResponse;
import com.ducthe.backend.dto.response.OrderResponse;
import com.ducthe.backend.entity.*;
import com.ducthe.backend.enums.DiscountType;
import com.ducthe.backend.exception.BadRequestException;
import com.ducthe.backend.exception.ResourceNotFoundException;
import com.ducthe.backend.repository.CartRepository;
import com.ducthe.backend.repository.CouponRepository;
import com.ducthe.backend.repository.OrderRepository;
import com.ducthe.backend.service.MapperService;
import com.ducthe.backend.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {
    private static final BigDecimal DEFAULT_SHIPPING_FEE = new BigDecimal("30000");

    private final CartRepository cartRepository;
    private final CouponRepository couponRepository;
    private final OrderRepository orderRepository;
    private final MapperService mapper;

    public OrderServiceImpl(CartRepository cartRepository, CouponRepository couponRepository, OrderRepository orderRepository, MapperService mapper) {
        this.cartRepository = cartRepository;
        this.couponRepository = couponRepository;
        this.orderRepository = orderRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public OrderResponse create(OrderRequest request) {
        Cart cart = cartRepository.findBySessionId(request.sessionId()).orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }
        BigDecimal subtotal = cart.getItems().stream().map(CartItem::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal shippingFee = DEFAULT_SHIPPING_FEE;
        Coupon coupon = request.couponCode() == null || request.couponCode().isBlank() ? null : validCoupon(request.couponCode(), subtotal);
        BigDecimal discount = discount(coupon, subtotal, shippingFee);
        if (coupon != null && coupon.getDiscountType() == DiscountType.FREE_SHIPPING) {
            shippingFee = BigDecimal.ZERO;
        }
        Order order = Order.builder()
                .orderCode("PMV" + System.currentTimeMillis())
                .billingAddress(address(request.billingAddress()))
                .shippingAddress(Boolean.TRUE.equals(request.shipToDifferentAddress()) && request.shippingAddress() != null ? address(request.shippingAddress()) : null)
                .shipToDifferentAddress(Boolean.TRUE.equals(request.shipToDifferentAddress()))
                .note(request.note())
                .subtotal(subtotal)
                .shippingFee(shippingFee)
                .discountAmount(discount)
                .totalAmount(subtotal.add(shippingFee).subtract(discount).max(BigDecimal.ZERO))
                .paymentMethod(request.paymentMethod())
                .coupon(coupon)
                .build();
        for (CartItem item : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .productCode(item.getProduct().getCode())
                    .variantSize(item.getVariant() == null ? null : item.getVariant().getSize())
                    .quantity(item.getQuantity())
                    .unitPrice(item.getUnitPrice())
                    .totalPrice(item.getTotalPrice())
                    .thumbnailUrl(mapper.thumbnail(item.getProduct()))
                    .build();
            order.getItems().add(orderItem);
            item.getProduct().setSoldCount(item.getProduct().getSoldCount() + item.getQuantity());
        }
        if (coupon != null) {
            coupon.setUsedCount(coupon.getUsedCount() + 1);
        }
        cart.getItems().clear();
        return mapper.toOrder(orderRepository.save(order));
    }

    @Override
    public OrderResponse getByCode(String orderCode) {
        return orderRepository.findByOrderCode(orderCode).map(mapper::toOrder).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public CouponApplyResponse applyCoupon(CouponApplyRequest request) {
        Coupon coupon = validCoupon(request.code(), request.subtotal());
        BigDecimal shippingFee = coupon.getDiscountType() == DiscountType.FREE_SHIPPING ? BigDecimal.ZERO : request.shippingFee();
        BigDecimal discount = discount(coupon, request.subtotal(), request.shippingFee());
        return new CouponApplyResponse(coupon.getCode(), discount, shippingFee, request.subtotal().add(shippingFee).subtract(discount).max(BigDecimal.ZERO));
    }

    private Coupon validCoupon(String code, BigDecimal subtotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code).orElseThrow(() -> new ResourceNotFoundException("Coupon not found"));
        LocalDateTime now = LocalDateTime.now();
        if (!coupon.isActive()
                || coupon.getStartDate() != null && coupon.getStartDate().isAfter(now)
                || coupon.getEndDate() != null && coupon.getEndDate().isBefore(now)
                || coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()
                || coupon.getMinOrderAmount() != null && subtotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            throw new BadRequestException("Coupon is not valid for this order");
        }
        return coupon;
    }

    private BigDecimal discount(Coupon coupon, BigDecimal subtotal, BigDecimal shippingFee) {
        if (coupon == null) return BigDecimal.ZERO;
        BigDecimal discount = switch (coupon.getDiscountType()) {
            case FIXED_AMOUNT -> coupon.getDiscountValue();
            case PERCENTAGE -> subtotal.multiply(coupon.getDiscountValue()).divide(new BigDecimal("100"));
            case FREE_SHIPPING -> shippingFee;
        };
        if (coupon.getMaxDiscountAmount() != null && discount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
            return coupon.getMaxDiscountAmount();
        }
        return discount;
    }

    private Address address(AddressRequest request) {
        return Address.builder()
                .fullName(request.fullName())
                .phone(request.phone())
                .email(request.email())
                .province(request.province())
                .district(request.district())
                .ward(request.ward())
                .detailAddress(request.detailAddress())
                .build();
    }
}
