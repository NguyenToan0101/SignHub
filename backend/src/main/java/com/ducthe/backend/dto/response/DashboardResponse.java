package com.ducthe.backend.dto.response;

import java.math.BigDecimal;

public record DashboardResponse(long products, long orders, long contactMessages, BigDecimal revenue) {
}
