package com.sba.service;

import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;

import java.sql.Timestamp;
import java.util.List;

public interface IOrderService {
    
    List<Order> getAllOrders();
    
    Order getOrderById(Long id);
    
    Order createOrder(Order order);
    
    Order updateOrder(Long id, Order order);
    
    void deleteOrder(Long id);
    
    List<Order> getOrdersByAccount(Long accountId);
    
    List<Order> getOrdersByStatus(OrderStatus status);
    
    List<Order> getOrdersByDateRange(Timestamp startDate, Timestamp endDate);
    
    List<Order> getOrdersByAccountAndStatus(Long accountId, OrderStatus status);
    
    List<Order> getOrdersByAmountRange(Double minAmount, Double maxAmount);
    
    List<Order> getOrdersOrderByDateDesc();
    
    Double getTotalAmountByStatus(OrderStatus status);
    
    Long countOrdersByAccount(Long accountId);
    
    Order updateOrderStatus(Long orderId, OrderStatus newStatus);
}
