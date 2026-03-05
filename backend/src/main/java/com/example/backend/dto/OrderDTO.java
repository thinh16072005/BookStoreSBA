package com.example.backend.dto;

import java.sql.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private int idOrder;
    private Date dateCreated; // Ngày tạo đơn hàng 
    private String deliveryAddress; // Địa chỉ giao hàng
    private String phoneNumber; // Số điện thoại (vì có thể tuỳ chỉnh)
    private String fullName; // Họ và tên của khách hàng (tuỳ chỉnh)
    private double totalPriceProduct; // Tổng tiền sản phẩm
    private double feeDelivery; // Chi phí giao hàng
    private double feePayment; // Chi phí thanh toán
    private double totalPrice; // Tổng tiền
    private String status; // Trạng thái của đơn hàng
    private String note; // Ghi chú
    private int idUser; // ID người dùng
    private int idPayment; // ID hình thức thanh toán
    private int idDelivery; // ID hình thức giao hàng
    private String paymentStatus; // Trạng thái thanh toán: PENDING (chưa thanh toán), PAID (đã thanh toán)
    private List<OrderDetailDTO> listOrderDetails; // Danh sách chi tiết đơn hàng
    private List<OrderItemRequest> orderItems; // Danh sách sách (idBook, quantity) từ client
    
    // Inner class để nhận thông tin từ client
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemRequest {
        private int idBook; // ID của sách
        private int quantity; // Số lượng
    }
}
