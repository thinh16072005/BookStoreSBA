package com.example.backend.controller;

import com.example.backend.dto.CouponDTO;
import com.example.backend.entity.Notification;
import com.example.backend.service.coupon.CouponService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/coupon")
public class CouponController {
    @Autowired
    private CouponService couponService;

    // Kiểm tra mã giảm giá
    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code) {
        return couponService.validateCoupon(code);
    }

    // Tạo mã giảm giá (admin)
    @PostMapping("/create/{quantity}")
    public ResponseEntity<?> createCoupon(@PathVariable int quantity, @RequestBody CouponDTO couponDTO) {
        if(quantity <= 0){
            return ResponseEntity.badRequest().body(new Notification("Số lượng mã giảm giá phải lớn hơn 0"));
        }
        return couponService.createCoupon(quantity, couponDTO);
    }

    // Xóa mã giảm giá (admin)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable int id) {
        return couponService.deleteCoupon(id);
    }

    // kích hoạt / hủy kích hoạt mã giảm giá (admin)
    @PutMapping("/update/active/{id}")
    public ResponseEntity<?> updateActiveCoupon(@PathVariable int id, @RequestBody CouponDTO couponDTO) {
        return couponService.updateActiveCoupon(id, couponDTO);
    }

    // Sử dụng mã giảm giá
    @PutMapping("/update/used")
    public ResponseEntity<?> updateUsedCoupon(@RequestParam String code) {
        return couponService.updateUsedCoupon(code);
    }
}