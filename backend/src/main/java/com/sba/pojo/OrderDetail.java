package com.sba.pojo;

import jakarta.persistence.*;
import org.aspectj.weaver.ast.Or;

@Entity
@Table(name = "order_detail")
public class OrderDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long orderDetailId;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "orchid_id", nullable = false)
    private Orchid orchid;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Orchid getOrchid() {
        return orchid;
    }

    public void setOrchid(Orchid orchid) {
        this.orchid = orchid;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public OrderDetail(Long orderDetailId, Double price, Integer quantity, Orchid orchid, Order order) {
        this.orderDetailId = orderDetailId;
        this.price = price;
        this.quantity = quantity;
        this.orchid = orchid;
        this.order = order;
    }

    public OrderDetail(Double price, Integer quantity, Orchid orchid, Order order) {
        this.price = price;
        this.quantity = quantity;
        this.orchid = orchid;
        this.order = order;
    }

    public OrderDetail(Double price, Integer quantity, Orchid orchid) {
        this.price = price;
        this.quantity = quantity;
        this.orchid = orchid;
    }

    public OrderDetail() {
    }

}
