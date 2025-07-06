package com.sba.dto;


public class OrderDetailResponse {
    private String orchidName;
    private String orchidUrl;
    private Integer quantity;
    private Double price;

    public OrderDetailResponse() {
    }

    public OrderDetailResponse(String orchidName, String orchidUrl, Double price, Integer quantity) {
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.price = price;
        this.quantity = quantity;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public String getOrchidUrl() {
        return orchidUrl;
    }

    public void setOrchidUrl(String orchidUrl) {
        this.orchidUrl = orchidUrl;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
