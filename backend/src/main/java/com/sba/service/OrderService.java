package com.sba.service;

import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;
import com.sba.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

@Service
public class OrderService implements IOrderService {
    
    @Autowired
    private IOrderRepository orderRepository;
    
    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    
    @Override
    public Order createOrder(Order order) {
        if (order.getOrderDate() == null) {
            order.setOrderDate(new Timestamp(System.currentTimeMillis()));
        }
        if (order.getOrderStatus() == null) {
            order.setOrderStatus(OrderStatus.PENDING);
        }
        return orderRepository.save(order);
    }
    
    @Override
    public Order updateOrder(Long id, Order order) {
        Order existingOrder = getOrderById(id);
        
        existingOrder.setOrderDate(order.getOrderDate());
        existingOrder.setOrderStatus(order.getOrderStatus());
        existingOrder.setTotalAmount(order.getTotalAmount());
        existingOrder.setAccount(order.getAccount());
        
        return orderRepository.save(existingOrder);
    }
    
    @Override
    public void deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        orderRepository.deleteById(id);
    }
    
    @Override
    public List<Order> getOrdersByAccount(Long accountId) {
        return orderRepository.findByAccount_AccountId(accountId);
    }
    
    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByOrderStatus(status);
    }
    
    @Override
    public List<Order> getOrdersByDateRange(Timestamp startDate, Timestamp endDate) {
        return orderRepository.findByOrderDateBetween(startDate, endDate);
    }
    
    @Override
    public List<Order> getOrdersByAccountAndStatus(Long accountId, OrderStatus status) {
        return orderRepository.findByAccountIdAndOrderStatus(accountId, status);
    }
    
    @Override
    public List<Order> getOrdersByAmountRange(Double minAmount, Double maxAmount) {
        return orderRepository.findByTotalAmountBetween(minAmount, maxAmount);
    }
    
    @Override
    public List<Order> getOrdersOrderByDateDesc() {
        return orderRepository.findAllOrderByOrderDateDesc();
    }
    
    @Override
    public Double getTotalAmountByStatus(OrderStatus status) {
        return orderRepository.getTotalAmountByStatus(status);
    }
    
    @Override
    public Long countOrdersByAccount(Long accountId) {
        return orderRepository.countOrdersByAccountId(accountId);
    }
    
    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setOrderStatus(newStatus);
        return orderRepository.save(order);
    }
}
