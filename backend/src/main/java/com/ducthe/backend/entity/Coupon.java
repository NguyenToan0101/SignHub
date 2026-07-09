package com.ducthe.backend.entity;

import com.ducthe.backend.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "coupons")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String code;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    @Column(nullable = false, precision = 14, scale = 2)
    private BigDecimal discountValue;

    @Column(precision = 14, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(precision = 14, scale = 2)
    private BigDecimal minOrderAmount;

    private Integer usageLimit;

    @Column(nullable = false)
    @Builder.Default
    private int usedCount = 0;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
