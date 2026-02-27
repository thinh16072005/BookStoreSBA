package com.example.backend.dto;
import lombok.Data;

@Data
public class CartItemDTO {
    private int idBook;
    private int quantity;
    private int idUser ;
}
