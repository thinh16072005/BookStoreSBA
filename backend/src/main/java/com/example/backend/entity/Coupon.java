package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.sql.Date;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "coupon")
public class Coupon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_coupon")
    private int idCoupon;
    
    @Column(name = "code", unique = true, nullable = false)
    private String code;
    
    @Column(name = "discount_percent", nullable = false)
    private int discountPercent; // Giảm giá bao nhiêu %
    
    @Column(name = "expiry_date", nullable = false)
    private Date expiryDate; // Ngày hết hạn

    @Column(name = "is_active", nullable = false)
    @JsonProperty("isActive")
    private boolean isActive; // Kích hoạt
    
    @Column(name = "is_used", nullable = false)
    @JsonProperty("isUsed")
    private boolean isUsed; // Đã sử dụng chưa
}