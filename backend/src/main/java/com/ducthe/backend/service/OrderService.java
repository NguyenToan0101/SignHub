package com.ducthe.backend.service;

import com.ducthe.backend.dto.request.CouponApplyRequest;
import com.ducthe.backend.dto.request.OrderRequest;
import com.ducthe.backend.dto.response.CouponApplyResponse;
import com.ducthe.backend.dto.response.OrderResponse;

public interface OrderService {
    OrderResponse create(OrderRequest request);
    OrderResponse getByCode(String orderCode);
    CouponApplyResponse applyCoupon(CouponApplyRequest request);
}
