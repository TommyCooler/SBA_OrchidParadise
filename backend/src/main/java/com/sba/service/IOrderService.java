package com.sba.service;

import com.sba.dto.OrderRequest;
import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;

import java.sql.Timestamp;
import java.util.List;

public interface IOrderService {
    // Existing methods...
    List<Order> getAllOrders();
    Order getOrderById(Long id);
    
    // User methods (with token validation)
    String createOrder(OrderRequest orderRequest, String token);
    String updateOrder(Long orderId, OrderRequest orderRequest, String token);
    String deleteOrder(Long orderId, String token);
    List<Order> getMyOrders(String token);
    List<Order> getMyOrdersByStatus(String token, OrderStatus status);
    
    // Admin methods (without token validation)
    Order updateOrderForAdmin(Long id, Order order);
    void deleteOrderAdmin(Long id);
    Order updateOrderStatus(Long orderId, OrderStatus newStatus);
    
    // Query methods
    List<Order> getOrdersByAccount(String token);
    List<Order> getOrdersByStatus(OrderStatus status);
    List<Order> getOrdersByAccountAndStatus(Long accountId, OrderStatus status);
    List<Order> getOrdersByDateRange(Timestamp startDate, Timestamp endDate);
    List<Order> getOrdersByAmountRange(Double minAmount, Double maxAmount);
    List<Order> getOrdersOrderByDateDesc();
    
    // Statistics methods
    Double getTotalAmountByStatus(OrderStatus status);
    Long countOrdersByAccount(Long accountId);
}
