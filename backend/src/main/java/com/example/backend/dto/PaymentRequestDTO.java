package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequestDTO {
    private String productName;
    private String description;
    private String returnUrl;
    private String cancelUrl;
    private int amount;
}