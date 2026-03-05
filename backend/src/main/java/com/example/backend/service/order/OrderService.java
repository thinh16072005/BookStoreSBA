package com.example.backend.service.order;

import org.springframework.http.ResponseEntity;

import com.example.backend.dto.OrderDTO;

public interface OrderService {
    public ResponseEntity<?> save(OrderDTO orderDTO);
    public ResponseEntity<?> update(OrderDTO orderDTO);

}
