package com.sba.repository;

import com.sba.pojo.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IOrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    
    List<OrderDetail> findByOrder_OrderId(Long orderId);
    
    List<OrderDetail> findByOrchid_OrchidId(Long orchidId);
    
    @Query("SELECT od FROM OrderDetail od WHERE od.order.orderId = :orderId AND od.orchid.orchidId = :orchidId")
    OrderDetail findByOrderIdAndOrchidId(@Param("orderId") Long orderId, @Param("orchidId") Long orchidId);
    
    @Query("SELECT SUM(od.quantity) FROM OrderDetail od WHERE od.orchid.orchidId = :orchidId")
    Integer getTotalQuantityByOrchidId(@Param("orchidId") Long orchidId);
    
    @Query("SELECT SUM(od.price * od.quantity) FROM OrderDetail od WHERE od.order.orderId = :orderId")
    Double getTotalAmountByOrderId(@Param("orderId") Long orderId);
    
    @Query("SELECT od FROM OrderDetail od WHERE od.price BETWEEN :minPrice AND :maxPrice")
    List<OrderDetail> findByPriceBetween(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
    
    @Query("SELECT od FROM OrderDetail od WHERE od.quantity >= :minQuantity")
    List<OrderDetail> findByQuantityGreaterThanEqual(@Param("minQuantity") Integer minQuantity);
    
    void deleteByOrder_OrderId(Long orderId);
}
