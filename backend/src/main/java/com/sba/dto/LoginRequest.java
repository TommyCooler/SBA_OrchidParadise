package com.sba.dto;

public record LoginRequest(String accountName, String password) {
    public LoginRequest {
        if (accountName == null || accountName.isBlank()) {
            throw new IllegalArgumentException("Email cannot be null or blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }
    }
}
