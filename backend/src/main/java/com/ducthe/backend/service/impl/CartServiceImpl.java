package com.ducthe.backend.service.impl;

import com.ducthe.backend.dto.request.CartItemRequest;
import com.ducthe.backend.dto.request.UpdateCartItemRequest;
import com.ducthe.backend.dto.response.CartResponse;
import com.ducthe.backend.entity.Cart;
import com.ducthe.backend.entity.CartItem;
import com.ducthe.backend.entity.Product;
import com.ducthe.backend.entity.ProductVariant;
import com.ducthe.backend.exception.BadRequestException;
import com.ducthe.backend.exception.ResourceNotFoundException;
import com.ducthe.backend.repository.CartItemRepository;
import com.ducthe.backend.repository.CartRepository;
import com.ducthe.backend.repository.ProductRepository;
import com.ducthe.backend.repository.ProductVariantRepository;
import com.ducthe.backend.service.CartService;
import com.ducthe.backend.service.MapperService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final MapperService mapper;

    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, ProductVariantRepository variantRepository, MapperService mapper) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.variantRepository = variantRepository;
        this.mapper = mapper;
    }

    @Override
    public CartResponse getCart(String sessionId) {
        return mapper.toCart(cart(sessionId));
    }

    @Override
    @Transactional
    public CartResponse addItem(CartItemRequest request) {
        Cart cart = cart(request.sessionId());
        Product product = productRepository.findById(request.productId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        ProductVariant variant = request.variantId() == null ? null : variantRepository.findById(request.variantId()).orElseThrow(() -> new ResourceNotFoundException("Variant not found"));
        BigDecimal unitPrice = product.getBasePrice().add(variant == null ? BigDecimal.ZERO : variant.getExtraPrice());
        CartItem item = CartItem.builder()
                .cart(cart)
                .product(product)
                .variant(variant)
                .quantity(request.quantity())
                .unitPrice(unitPrice)
                .totalPrice(unitPrice.multiply(BigDecimal.valueOf(request.quantity())))
                .build();
        cart.getItems().add(item);
        return mapper.toCart(cartRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse updateItem(UUID itemId, UpdateCartItemRequest request) {
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setQuantity(request.quantity());
        item.setTotalPrice(item.getUnitPrice().multiply(BigDecimal.valueOf(request.quantity())));
        cartItemRepository.save(item);
        return mapper.toCart(item.getCart());
    }

    @Override
    @Transactional
    public void removeItem(UUID itemId, String sessionId) {
        CartItem item = cartItemRepository.findById(itemId).orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.getCart().getItems().remove(item);
        cartItemRepository.delete(item);
    }

    @Override
    @Transactional
    public void clear(String sessionId) {
        Cart cart = cart(sessionId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart cart(String sessionId) {
        if (sessionId == null || sessionId.isBlank()) {
            throw new BadRequestException("sessionId is required");
        }
        return cartRepository.findBySessionId(sessionId).orElseGet(() -> cartRepository.save(Cart.builder().sessionId(sessionId).build()));
    }
}
