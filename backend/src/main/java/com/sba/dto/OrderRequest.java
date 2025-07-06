package com.sba.dto;

public record OrderRequest (Integer quantity,
                            Long orchidId) {
    public OrderRequest {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        if (orchidId == null || orchidId <= 0) {
            throw new IllegalArgumentException("Orchid ID must be a valid positive number");
        }
    }

}
