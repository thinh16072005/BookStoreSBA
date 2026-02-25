package com.example.backend.service.email;

public interface EmailService {
    //Gửi email
    public void sendMessage(String from, String to, String subject, String message);
}
