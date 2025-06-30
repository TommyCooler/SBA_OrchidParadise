package com.sba.service;

import com.sba.pojo.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    
    List<OrderDetail> getAllOrderDetails();
    
    OrderDetail getOrderDetailById(Long id);
    
    OrderDetail createOrderDetail(OrderDetail orderDetail);
    
    OrderDetail updateOrderDetail(Long id, OrderDetail orderDetail);
    
    void deleteOrderDetail(Long id);
    
    List<OrderDetail> getOrderDetailsByOrder(Long orderId);
    
    List<OrderDetail> getOrderDetailsByOrchid(Long orchidId);
    
    OrderDetail getOrderDetailByOrderAndOrchid(Long orderId, Long orchidId);
    
    Integer getTotalQuantityByOrchid(Long orchidId);
    
    Double getTotalAmountByOrder(Long orderId);
    
    List<OrderDetail> getOrderDetailsByPriceRange(Double minPrice, Double maxPrice);
    
    List<OrderDetail> getOrderDetailsByMinQuantity(Integer minQuantity);
    
    void deleteOrderDetailsByOrder(Long orderId);
}
