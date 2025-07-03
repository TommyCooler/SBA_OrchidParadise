package com.sba.repository;

import com.sba.enums.OrderStatus;
import com.sba.pojo.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public interface IOrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByAccount_AccountId(Long accountId);
    
    List<Order> findByOrderStatus(OrderStatus orderStatus);
    
    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findByOrderDateBetween(@Param("startDate") Timestamp startDate, @Param("endDate") Timestamp endDate);
    
    @Query("SELECT o FROM Order o WHERE o.account.accountId = :accountId AND o.orderStatus = :status")
    Order findByAccountIdAndOrderStatus(@Param("accountId") Long accountId, @Param("status") OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.totalAmount BETWEEN :minAmount AND :maxAmount")
    List<Order> findByTotalAmountBetween(@Param("minAmount") Double minAmount, @Param("maxAmount") Double maxAmount);
    
    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC")
    List<Order> findAllOrderByOrderDateDesc();
    
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.orderStatus = :status")
    Double getTotalAmountByStatus(@Param("status") OrderStatus status);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.account.accountId = :accountId")
    Long countOrdersByAccountId(@Param("accountId") Long accountId);
    
    List<Order> findByAccount_AccountIdAndOrderStatus(Long accountId, OrderStatus status);

}
