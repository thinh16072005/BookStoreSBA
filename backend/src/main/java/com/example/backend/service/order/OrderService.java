package com.example.backend.service.order;

import com.example.backend.dto.OrderDTO;
import org.springframework.http.ResponseEntity;

public interface OrderService {
    public ResponseEntity<?> save(OrderDTO orderDTO);
    public ResponseEntity<?> update(OrderDTO orderDTO);

}
