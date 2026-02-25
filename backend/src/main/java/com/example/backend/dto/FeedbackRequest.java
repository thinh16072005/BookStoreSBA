package com.example.backend.dto;

/**
 * Đây là Data Transfer Object (DTO) đại diện cho dữ liệu
 * mà Frontend gửi lên khi thêm một Feedback.
 */
public class FeedbackRequest {

    private String user; // Sẽ nhận username từ JSON (ví dụ: "tuancm24")
    private String title;
    private String comment;

    // --------- Getter/Setter ---------
    // (Spring Boot/Jackson cần các hàm này để gán dữ liệu)

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}