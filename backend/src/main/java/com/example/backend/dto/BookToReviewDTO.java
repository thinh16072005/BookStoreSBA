package com.example.backend.dto;

import lombok.Data;


@Data
public class BookToReviewDTO {
    private long idOrderDetail;
    private String bookName;
    private String author;
    private String bookImage;
    private int orderId;
    private String dateCreated;
    // Constructor để gán dữ liệu
    public BookToReviewDTO(long idOrderDetail, String bookName, String author, String bookImage, int orderId, String dateCreated) {
        this.idOrderDetail = idOrderDetail;
        this.bookName = bookName;
        this.author = author;
        this.bookImage = bookImage;
        this.orderId = orderId;
        this.dateCreated = dateCreated;
    }
}