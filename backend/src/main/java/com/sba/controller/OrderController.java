package com.sba.controller;

import com.sba.dto.OrderRequest;
import com.sba.dto.OrderResponse;
import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;
import com.sba.service.IOrderService;
import com.sba.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @Autowired
    private VNPayService vnPayService;

    @GetMapping("/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        try {
            List<Order> orders = orderService.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            orderService.createOrder(orderRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body("Order created successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // @PutMapping("/{id}")
    // public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody OrderRequest orderRequest, @RequestHeader String token) {
    //     try {
    //         Order updatedOrder = orderService.updateOrder(id, orderRequest, token);
    //         return ResponseEntity.ok(updatedOrder);
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }

    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
    //     try {
    //         orderService.deleteOrder(id);
    //         return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    //     } catch (Exception e) {
    //         return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    //     }
    // }

    @GetMapping("")
    public ResponseEntity<?> getOrdersByAccount() {
        try {
            List<Order> orders = orderService.getMyOrders();
            List<OrderResponse> orderResponses = new ArrayList<>();
            for (Order order : orders) {
                OrderResponse response = new OrderResponse();
                response.setOrderId(order.getOrderId());
                response.setOrderStatus(order.getOrderStatus().toString());
                response.setTotalAmount(order.getTotalAmount());
                response.setOrderDate(order.getOrderDate());
                orderResponses.add(response);
            }
            return ResponseEntity.ok(orderResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByStatus(@PathVariable OrderStatus status) {
        try {
            List<Order> orders = orderService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Timestamp startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Timestamp endDate) {
        try {
            List<Order> orders = orderService.getOrdersByDateRange(startDate, endDate);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/account/{accountId}/status/{status}")
    public ResponseEntity<List<Order>> getOrdersByAccountAndStatus(
            @PathVariable Long accountId, 
            @PathVariable OrderStatus status) {
        try {
            List<Order> orders = orderService.getOrdersByAccountAndStatus(accountId, status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/amount-range")
    public ResponseEntity<List<Order>> getOrdersByAmountRange(
            @RequestParam Double minAmount, 
            @RequestParam Double maxAmount) {
        try {
            List<Order> orders = orderService.getOrdersByAmountRange(minAmount, maxAmount);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/sorted/date-desc")
    public ResponseEntity<List<Order>> getOrdersOrderByDateDesc() {
        try {
            List<Order> orders = orderService.getOrdersOrderByDateDesc();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/total-amount/status/{status}")
    public ResponseEntity<Double> getTotalAmountByStatus(@PathVariable OrderStatus status) {
        try {
            Double totalAmount = orderService.getTotalAmountByStatus(status);
            return ResponseEntity.ok(totalAmount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/count/account/{accountId}")
    public ResponseEntity<Long> countOrdersByAccount(@PathVariable Long accountId) {
        try {
            Long count = orderService.countOrdersByAccount(accountId);
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{orderId}/status/{newStatus}")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId, 
            @PathVariable OrderStatus newStatus) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, newStatus);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

//    @PostMapping("/payment/{orderId}")
//    public String createPayment(@PathVariable Long orderId) {
//        vnPayService.createPayment(orderId);
//    }


}
