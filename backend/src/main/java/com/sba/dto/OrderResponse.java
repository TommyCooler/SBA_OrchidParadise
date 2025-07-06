package com.sba.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Timestamp;

public class OrderResponse {

    @JsonProperty("order_id")
    private Long orderId;

    @JsonProperty("order_date")
    private Timestamp orderDate;

    @JsonProperty("order_status")
    private String orderStatus;

    @JsonProperty("total_amount")
    private Double totalAmount;

    public OrderResponse() {
    }

    public OrderResponse(Timestamp orderDate, String orderStatus, Double totalAmount) {
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
    }

    public OrderResponse(Long orderId, Timestamp orderDate, String orderStatus, Double totalAmount) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderStatus = orderStatus;
        this.totalAmount = totalAmount;
    }

    public Timestamp getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(Timestamp orderDate) {
        this.orderDate = orderDate;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
