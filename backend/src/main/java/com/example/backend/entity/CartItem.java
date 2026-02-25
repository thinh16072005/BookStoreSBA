package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "cart_item")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cart")
    private int idCart; //mã mục giỏ hàng 
    @Column (name = "quantity")
    private int quantity; //số lượng sách có trong mục giỏ hàng 
    @ManyToOne()
    @JoinColumn(name = "id_book", nullable = false)
    private Book book; // sách  
    @ManyToOne()
    @JoinColumn(name = "id_user", nullable = false)
    private User user; //người dùng

    @Override
    public String toString() {
        return "CartItem{" +
                "idCart=" + idCart +
                ", quantity=" + quantity +
                ", book=" + book.getIdBook() +
                '}';
    }
}
