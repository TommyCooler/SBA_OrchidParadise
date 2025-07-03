package com.sba.service;

import com.sba.dto.OrderRequest;
import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;
import com.sba.pojo.OrderDetail;
import com.sba.repository.IAccountRepository;
import com.sba.repository.IOrchidRepository;
import com.sba.repository.IOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Service
public class OrderService implements IOrderService {
    
    @Autowired
    private IOrderRepository iOrderRepository;

    @Autowired
    private IOrderDetailService iOrderDetailService;

    @Autowired
    private IOrchidRepository iOrchidRepository;

    @Autowired
    private IAccountRepository iAccountRepository;

    @Autowired
    private JwtService jwtService;
    
    @Override
    public List<Order> getAllOrders() {
        return iOrderRepository.findAll();
    }
    
    @Override
    public Order getOrderById(Long id) {
        return iOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    
    @Override
    public String createOrder(OrderRequest orderRequest, String token) {
        try {
            String message = "Order failed to create";
            
            // Extract account ID and get account/orchid once
            Long accountId = Long.parseLong(jwtService.extractAccountID(token));
            var account = iAccountRepository.findByAccountId(accountId);
            var orchid = iOrchidRepository.findByOrchidId(orderRequest.orchidId());
            
            // Validation
            if (account == null) {
                throw new RuntimeException("Account not found");
            }
            if (orchid == null) {
                throw new RuntimeException("Orchid not found");
            }
            
            // Find existing pending order
            Order order = iOrderRepository.findByAccountIdAndOrderStatus(accountId, OrderStatus.PENDING);
            
            // Calculate item total (price * quantity)
            Double itemTotal = orchid.getPrice() * orderRequest.quantity();
            
            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setPrice(orchid.getPrice());
            orderDetail.setQuantity(orderRequest.quantity());
            orderDetail.setOrchid(orchid);
            
            if (order == null) {
                // Create new order
                order = new Order(
                    new Timestamp(new Date().getTime()),
                    OrderStatus.PENDING,
                    itemTotal, // Use calculated itemTotal
                    account
                );
                order = iOrderRepository.save(order);
                message = "Order and order detail created successfully";
            } else {
                // Update existing order
                order.setTotalAmount(order.getTotalAmount() + itemTotal);
                order = iOrderRepository.save(order);
                message = "Order detail added to existing order";
            }
            
            // Set order for order detail and save
            orderDetail.setOrder(order);
            iOrderDetailService.createOrderDetail(orderDetail);
            
            return message;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to create order: " + e.getMessage());
        }
    }
    
    @Override
    public String updateOrder(Long orderId, OrderRequest orderRequest, String token) {
        try {
            // Extract account ID from token
            Long accountId = Long.parseLong(jwtService.extractAccountID(token));
            var account = iAccountRepository.findByAccountId(accountId);
            var orchid = iOrchidRepository.findByOrchidId(orderRequest.orchidId());
            
            // Validation
            if (account == null) {
                throw new RuntimeException("Account not found");
            }
            if (orchid == null) {
                throw new RuntimeException("Orchid not found");
            }
            
            // Get existing order
            Order existingOrder = getOrderById(orderId);
            
            // Check if user owns this order
            if (!existingOrder.getAccount().getAccountId().equals(accountId)) {
                throw new RuntimeException("You don't have permission to update this order");
            }
            
            // Only allow updating PENDING orders
            if (existingOrder.getOrderStatus() != OrderStatus.PENDING) {
                throw new RuntimeException("Can only update pending orders");
            }
            
            // Calculate new item total
            Double newItemTotal = orchid.getPrice() * orderRequest.quantity();
            
            // Update order
            existingOrder.setTotalAmount(newItemTotal);
            existingOrder.setOrderDate(new Timestamp(new Date().getTime()));
            Order updatedOrder = iOrderRepository.save(existingOrder);
            
            // Update order details - remove old details and add new ones
            // First, delete existing order details
            List<OrderDetail> existingDetails = iOrderDetailService.getOrderDetailsByOrder(orderId);
            for (OrderDetail detail : existingDetails) {
                iOrderDetailService.deleteOrderDetail(detail.getOrderDetailId());
            }
            
            // Create new order detail
            OrderDetail newOrderDetail = new OrderDetail();
            newOrderDetail.setPrice(orchid.getPrice());
            newOrderDetail.setQuantity(orderRequest.quantity());
            newOrderDetail.setOrchid(orchid);
            newOrderDetail.setOrder(updatedOrder);
            iOrderDetailService.createOrderDetail(newOrderDetail);
            
            return "Order updated successfully";
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to update order: " + e.getMessage());
        }
    }
    
    @Override
    public String deleteOrder(Long orderId, String token) {
        try {
            // Extract account ID from token
            Long accountId = Long.parseLong(jwtService.extractAccountID(token));
            var account = iAccountRepository.findByAccountId(accountId);
            
            // Validation
            if (account == null) {
                throw new RuntimeException("Account not found");
            }
            
            // Get existing order
            Order existingOrder = getOrderById(orderId);
            
            // Check if user owns this order
            if (!existingOrder.getAccount().getAccountId().equals(accountId)) {
                throw new RuntimeException("You don't have permission to delete this order");
            }
            
            // Only allow deleting PENDING orders
            if (existingOrder.getOrderStatus() != OrderStatus.PENDING) {
                throw new RuntimeException("Can only delete pending orders");
            }
            
            // Delete order details first (due to foreign key constraint)
            List<OrderDetail> orderDetails = iOrderDetailService.getOrderDetailsByOrder(orderId);
            for (OrderDetail detail : orderDetails) {
                iOrderDetailService.deleteOrderDetail(detail.getOrderDetailId());
            }
            
            // Delete the order
            iOrderRepository.deleteById(orderId);
            
            return "Order deleted successfully";
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete order: " + e.getMessage());
        }
    }

    // Admin method for deleting without token
    @Override
    public void deleteOrderAdmin(Long id) {
        if (!iOrderRepository.existsById(id)) {
            throw new RuntimeException("Order not found with id: " + id);
        }
        
        // Delete order details first
        List<OrderDetail> orderDetails = iOrderDetailService.getOrderDetailsByOrder(id);
        for (OrderDetail detail : orderDetails) {
            iOrderDetailService.deleteOrderDetail(detail.getOrderDetailId());
        }
        
        iOrderRepository.deleteById(id);
    }

    public List<Order> getOrdersByAccount(Long accountId) {
        return iOrderRepository.findByAccount_AccountId(accountId);
    }
    
    @Override
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return iOrderRepository.findByOrderStatus(status);
    }
    
    @Override
    public List<Order> getOrdersByDateRange(Timestamp startDate, Timestamp endDate) {
        return iOrderRepository.findByOrderDateBetween(startDate, endDate);
    }

    
    @Override
    public List<Order> getOrdersByAmountRange(Double minAmount, Double maxAmount) {
        return iOrderRepository.findByTotalAmountBetween(minAmount, maxAmount);
    }
    
    @Override
    public List<Order> getOrdersOrderByDateDesc() {
        return iOrderRepository.findAllOrderByOrderDateDesc();
    }
    
    @Override
    public Double getTotalAmountByStatus(OrderStatus status) {
        return iOrderRepository.getTotalAmountByStatus(status);
    }
    
    @Override
    public Long countOrdersByAccount(Long accountId) {
        return iOrderRepository.countOrdersByAccountId(accountId);
    }
    
    @Override
    public Order updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = getOrderById(orderId);
        order.setOrderStatus(newStatus);
        return iOrderRepository.save(order);
    }

    @Override
    public List<Order> getOrdersByAccount(String token) {
        return List.of();
    }

    @Override
    public List<Order> getOrdersByAccountAndStatus(Long accountId, OrderStatus status) {
        return iOrderRepository.findByAccount_AccountIdAndOrderStatus(accountId, status);
    }

    // Thêm method để get orders by token
    @Override
    public List<Order> getMyOrders(String token) {
        try {
            Long accountId = Long.parseLong(jwtService.extractAccountID(token));
            return getOrdersByAccount(accountId);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get orders: " + e.getMessage());
        }
    }

    @Override
    public List<Order> getMyOrdersByStatus(String token, OrderStatus status) {
        try {
            Long accountId = Long.parseLong(jwtService.extractAccountID(token));
            return getOrdersByAccountAndStatus(accountId, status);
        } catch (Exception e) {
            throw new RuntimeException("Failed to get orders by status: " + e.getMessage());
        }
    }

    @Override
    public Order updateOrderForAdmin(Long id, Order order) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateOrderForAdmin'");
    }
}
