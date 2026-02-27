package com.example.backend.service.cart;

import com.example.backend.dto.CartItemDTO;
import org.springframework.http.ResponseEntity;

public interface CartService {
    // Thêm sản phẩm vào giỏ hàng
    public ResponseEntity<?> save(CartItemDTO cartItemDTO);

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public ResponseEntity<?> updateQuantity(int idCart, CartItemDTO cartItemDTO);
}
