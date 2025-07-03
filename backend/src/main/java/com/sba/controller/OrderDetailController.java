package com.sba.controller;

import com.sba.pojo.OrderDetail;
import com.sba.service.IOrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {

    @Autowired
    private IOrderDetailService orderDetailService;

    @GetMapping
    public ResponseEntity<List<OrderDetail>> getAllOrderDetails() {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getAllOrderDetails();
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetail> getOrderDetailById(@PathVariable Long id) {
        try {
            OrderDetail orderDetail = orderDetailService.getOrderDetailById(id);
            return ResponseEntity.ok(orderDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<OrderDetail> createOrderDetail(@RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail createdOrderDetail = orderDetailService.createOrderDetail(orderDetail);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrderDetail);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetail> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail updatedOrderDetail = orderDetailService.updateOrderDetail(id, orderDetail);
            return ResponseEntity.ok(updatedOrderDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        try {
            orderDetailService.deleteOrderDetail(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByOrder(@PathVariable Long orderId) {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByOrder(orderId);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/orchid/{orchidId}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByOrchid(@PathVariable Long orchidId) {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByOrchid(orchidId);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/order/{orderId}/orchid/{orchidId}")
    public ResponseEntity<OrderDetail> getOrderDetailByOrderAndOrchid(
            @PathVariable Long orderId, 
            @PathVariable Long orchidId) {
        try {
            OrderDetail orderDetail = orderDetailService.getOrderDetailByOrderAndOrchid(orderId, orchidId);
            return ResponseEntity.ok(orderDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/total-quantity/orchid/{orchidId}")
    public ResponseEntity<Integer> getTotalQuantityByOrchid(@PathVariable Long orchidId) {
        try {
            Integer totalQuantity = orderDetailService.getTotalQuantityByOrchid(orchidId);
            return ResponseEntity.ok(totalQuantity);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/total-amount/order/{orderId}")
    public ResponseEntity<Double> getTotalAmountByOrder(@PathVariable Long orderId) {
        try {
            Double totalAmount = orderDetailService.getTotalAmountByOrder(orderId);
            return ResponseEntity.ok(totalAmount);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByPriceRange(
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/min-quantity/{minQuantity}")
    public ResponseEntity<List<OrderDetail>> getOrderDetailsByMinQuantity(@PathVariable Integer minQuantity) {
        try {
            List<OrderDetail> orderDetails = orderDetailService.getOrderDetailsByMinQuantity(minQuantity);
            return ResponseEntity.ok(orderDetails);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/order/{orderId}")
    public ResponseEntity<Void> deleteOrderDetailsByOrder(@PathVariable Long orderId) {
        try {
            orderDetailService.deleteOrderDetailsByOrder(orderId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
