package com.ducthe.backend.controller;

import com.ducthe.backend.dto.request.CouponApplyRequest;
import com.ducthe.backend.dto.request.OrderRequest;
import com.ducthe.backend.dto.response.CouponApplyResponse;
import com.ducthe.backend.dto.response.OrderResponse;
import com.ducthe.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/api/orders")
    public OrderResponse create(@Valid @RequestBody OrderRequest request) {
        return orderService.create(request);
    }

    @GetMapping("/api/orders/{orderCode}")
    public OrderResponse get(@PathVariable String orderCode) {
        return orderService.getByCode(orderCode);
    }

    @PostMapping("/api/coupons/apply")
    public CouponApplyResponse applyCoupon(@Valid @RequestBody CouponApplyRequest request) {
        return orderService.applyCoupon(request);
    }
}
