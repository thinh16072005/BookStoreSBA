package com.example.backend.dto.response.cart;
import lombok.Data;

@Data
public class CartItemDTO {
    private int idBook;
    private int quantity;
    private int idUser ;
}
