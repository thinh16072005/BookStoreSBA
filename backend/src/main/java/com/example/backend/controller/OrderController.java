package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.OrderDTO;
import com.example.backend.service.order.OrderService;

@RestController
@RequestMapping("/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    // Thêm đơn hàng
    @PostMapping("/add-order")
    public ResponseEntity<?> save(@RequestBody OrderDTO orderDTO) {
        try {
            return orderService.save(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Hủy đơn hàng 
    @PutMapping("/update-order")
    public ResponseEntity<?> update(@RequestBody OrderDTO orderDTO) {
        try {
            return orderService.update(orderDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
