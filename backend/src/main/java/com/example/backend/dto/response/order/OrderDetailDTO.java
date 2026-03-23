package com.example.backend.dto.response.order;

import com.example.backend.entity.book.Book;
import com.example.backend.entity.order.Order;
import lombok.Data;

@Data
public class OrderDetailDTO {
    private int quantity; // Số lượng
    private double price; // Giá của 1 quyển sách
    private boolean isReview; // đã đánh giá chưa
    private Book book; // Mã sách
    private Order order; // Mã đơn hàng
}
