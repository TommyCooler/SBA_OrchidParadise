package com.sba.dto;

import jakarta.validation.constraints.*;

public record OrchidRequest(
    @NotNull(message = "IsNatural field is required")
    Boolean isNatural,
    
    @NotBlank(message = "Orchid description is required")
    @Size(max = 500, message = "Orchid description must not exceed 500 characters")
    String orchidDescription,
    
    @NotBlank(message = "Orchid name is required")
    @Size(max = 100, message = "Orchid name must not exceed 100 characters")
    String orchidName,
    
    @NotBlank(message = "Orchid URL is required")
    @Size(max = 255, message = "Orchid URL must not exceed 255 characters")
    String orchidUrl,
    
    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    Double price,
    
    @NotNull(message = "Category ID is required")
    Long categoryId
) {
    // Có thể thêm validation methods nếu cần
    public OrchidRequest {
        if (price != null && price <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
    }
}