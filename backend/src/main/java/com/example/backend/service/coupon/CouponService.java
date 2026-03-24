package com.example.backend.service.coupon;

import com.example.backend.dto.response.coupon.CouponDTO;
import org.springframework.http.ResponseEntity;

public interface CouponService {
    ResponseEntity<?> validateCoupon(String code);

    ResponseEntity<?> createCoupon(int quantity, CouponDTO couponDTO);

    ResponseEntity<?> deleteCoupon(int id);

    ResponseEntity<?> updateActiveCoupon(int id, CouponDTO couponDTO);

    ResponseEntity<?> updateUsedCoupon(String code);

}