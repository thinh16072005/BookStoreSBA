package com.example.backend.entity.order;

import com.example.backend.entity.order.Order;
import com.example.backend.entity.order.Delivery;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "delivery")
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_delivery")
    private int idDelivery; // Mã giao hàng
    @Column(name = "name_delivery", columnDefinition = "NVARCHAR(255)")
    private String nameDelivery; // Tên giao hàng
    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description; // Mô tả
    @Column(name = "fee_delivery")
    private double feeDelivery; // Chi phí giao hàng

    @OneToMany(mappedBy = "delivery", fetch = FetchType.LAZY, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private List<Order> listOrders; // Danh sách đơn hàng
}
