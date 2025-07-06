package com.sba.dto;


public class OrderDetailResponse {
    private Long orderDetailId;
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

    public OrderDetailResponse(Long orderDetailId, String orchidName, String orchidUrl, Double price, Integer quantity) {
        this.orderDetailId = orderDetailId;
        this.orchidName = orchidName;
        this.orchidUrl = orchidUrl;
        this.quantity = quantity;
        this.price = price;
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

    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }
}
