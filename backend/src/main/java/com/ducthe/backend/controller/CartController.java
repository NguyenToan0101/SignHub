package com.ducthe.backend.controller;

import com.ducthe.backend.dto.request.CartItemRequest;
import com.ducthe.backend.dto.request.UpdateCartItemRequest;
import com.ducthe.backend.dto.response.CartResponse;
import com.ducthe.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public CartResponse get(@RequestParam String sessionId) {
        return cartService.getCart(sessionId);
    }

    @PostMapping("/items")
    public CartResponse add(@Valid @RequestBody CartItemRequest request) {
        return cartService.addItem(request);
    }

    @PutMapping("/items/{id}")
    public CartResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItem(id, request);
    }

    @DeleteMapping("/items/{id}")
    public void delete(@PathVariable UUID id, @RequestParam(required = false) String sessionId) {
        cartService.removeItem(id, sessionId);
    }

    @DeleteMapping("/clear")
    public void clear(@RequestParam String sessionId) {
        cartService.clear(sessionId);
    }
}
