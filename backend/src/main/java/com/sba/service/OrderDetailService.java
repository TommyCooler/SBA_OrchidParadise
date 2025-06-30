package com.sba.service;

import com.sba.pojo.OrderDetail;
import com.sba.repository.IOrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService implements IOrderDetailService {
    
    @Autowired
    private IOrderDetailRepository orderDetailRepository;
    
    @Override
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }
    
    @Override
    public OrderDetail getOrderDetailById(Long id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found with id: " + id));
    }
    
    @Override
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }
    
    @Override
    public OrderDetail updateOrderDetail(Long id, OrderDetail orderDetail) {
        OrderDetail existingOrderDetail = getOrderDetailById(id);
        
        existingOrderDetail.setPrice(orderDetail.getPrice());
        existingOrderDetail.setQuantity(orderDetail.getQuantity());
        existingOrderDetail.setOrchid(orderDetail.getOrchid());
        existingOrderDetail.setOrder(orderDetail.getOrder());
        
        return orderDetailRepository.save(existingOrderDetail);
    }
    
    @Override
    public void deleteOrderDetail(Long id) {
        if (!orderDetailRepository.existsById(id)) {
            throw new RuntimeException("OrderDetail not found with id: " + id);
        }
        orderDetailRepository.deleteById(id);
    }
    
    @Override
    public List<OrderDetail> getOrderDetailsByOrder(Long orderId) {
        return orderDetailRepository.findByOrder_OrderId(orderId);
    }
    
    @Override
    public List<OrderDetail> getOrderDetailsByOrchid(Long orchidId) {
        return orderDetailRepository.findByOrchid_OrchidId(orchidId);
    }
    
    @Override
    public OrderDetail getOrderDetailByOrderAndOrchid(Long orderId, Long orchidId) {
        OrderDetail orderDetail = orderDetailRepository.findByOrderIdAndOrchidId(orderId, orchidId);
        if (orderDetail == null) {
            throw new RuntimeException("OrderDetail not found with orderId: " + orderId + " and orchidId: " + orchidId);
        }
        return orderDetail;
    }
    
    @Override
    public Integer getTotalQuantityByOrchid(Long orchidId) {
        Integer totalQuantity = orderDetailRepository.getTotalQuantityByOrchidId(orchidId);
        return totalQuantity != null ? totalQuantity : 0;
    }
    
    @Override
    public Double getTotalAmountByOrder(Long orderId) {
        Double totalAmount = orderDetailRepository.getTotalAmountByOrderId(orderId);
        return totalAmount != null ? totalAmount : 0.0;
    }
    
    @Override
    public List<OrderDetail> getOrderDetailsByPriceRange(Double minPrice, Double maxPrice) {
        return orderDetailRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    @Override
    public List<OrderDetail> getOrderDetailsByMinQuantity(Integer minQuantity) {
        return orderDetailRepository.findByQuantityGreaterThanEqual(minQuantity);
    }
    
    @Override
    public void deleteOrderDetailsByOrder(Long orderId) {
        orderDetailRepository.deleteByOrder_OrderId(orderId);
    }
}
