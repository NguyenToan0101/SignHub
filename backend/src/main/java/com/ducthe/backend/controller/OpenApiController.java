package com.ducthe.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class OpenApiController {
    @GetMapping("/v3/api-docs")
    public Map<String, Object> docs() {
        return Map.of(
                "openapi", "3.0.3",
                "info", Map.of("title", "PMV Decor SignHub API", "version", "1.0.0"),
                "servers", new Object[]{Map.of("url", "http://localhost:8080")},
                "paths", Map.of(
                        "/api/public/home", Map.of("get", Map.of("summary", "Home data")),
                        "/api/public/products", Map.of("get", Map.of("summary", "Paged products")),
                        "/api/public/products/{slug}", Map.of("get", Map.of("summary", "Product detail")),
                        "/api/cart/items", Map.of("post", Map.of("summary", "Add cart item")),
                        "/api/orders", Map.of("post", Map.of("summary", "Create order")),
                        "/api/admin/auth/login", Map.of("post", Map.of("summary", "Admin login")),
                        "/api/admin/products", Map.of("get", Map.of("summary", "Admin products"), "post", Map.of("summary", "Create product"))
                )
        );
    }
}
