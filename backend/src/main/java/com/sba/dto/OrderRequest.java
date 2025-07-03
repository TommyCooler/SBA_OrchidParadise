package com.sba.dto;

public record OrderRequest (Double price, 
                            Integer quantity, 
                            Long orchidId) {
    public OrderRequest {
        if (price == null || price <= 0) {
            throw new IllegalArgumentException("Price must be greater than zero");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        if (orchidId == null || orchidId <= 0) {
            throw new IllegalArgumentException("Orchid ID must be a valid positive number");
        }
    }

}
