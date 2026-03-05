package com.example.backend.controller;

import com.example.backend.security.ApiResponse;
import com.example.backend.dto.PaymentRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PayOS payOS;

    // Tạo link thanh toán
    @PostMapping("/create-payment-link")
    public ApiResponse<CreatePaymentLinkResponse> createPaymentLink(
            @RequestBody PaymentRequestDTO requestBody) {
        try {
            final String productName = requestBody.getProductName(); // Tên sản phẩm
            final String description = requestBody.getDescription(); // Mô tả
            final String returnUrl = requestBody.getReturnUrl(); // URL khi thanh toán thành công
            final String cancelUrl = requestBody.getCancelUrl(); // URL khi hủy thanh toán
            final long amount = requestBody.getAmount(); // Số tiền

            // Tạo mã đơn hàng
            long orderCode = System.currentTimeMillis() / 1000;

            // Tạo item
            PaymentLinkItem item = PaymentLinkItem.builder()
                    .name(productName)
                    .quantity(1)
                    .price(amount)
                    .build();

            // Tạo request
            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode) // Mã đơn hàng
                    .description(description) // Mô tả
                    .amount(amount) // Số tiền
                    .item(item) // Item
                    .returnUrl(returnUrl) // URL khi thanh toán thành công
                    .cancelUrl(cancelUrl) // URL khi hủy thanh toán
                    .build();

            // Tạo link thanh toán
            CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentData);
            return ApiResponse.success(data);

        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error("Tạo link thanh toán thất bại: " + e.getMessage());
        }
    }

}