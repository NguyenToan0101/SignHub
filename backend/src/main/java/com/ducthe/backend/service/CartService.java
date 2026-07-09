package com.ducthe.backend.service;

import com.ducthe.backend.dto.request.CartItemRequest;
import com.ducthe.backend.dto.request.UpdateCartItemRequest;
import com.ducthe.backend.dto.response.CartResponse;

import java.util.UUID;

public interface CartService {
    CartResponse getCart(String sessionId);
    CartResponse addItem(CartItemRequest request);
    CartResponse updateItem(UUID itemId, UpdateCartItemRequest request);
    void removeItem(UUID itemId, String sessionId);
    void clear(String sessionId);
}
