package com.example.backend.service.email;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService{
    @Autowired
    private JavaMailSender emailSender;

    //Gửi email
    @Override
    public void sendMessage(String from, String to, String subject, String message) {

        //MimeMailMessage  : có đính kèm file
        //SimpleMailMessage : nội dung thông thường 

        try{
            //Tạo một message rỗng 
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            //Tạo helper để thiết lập thông tin
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            // Thiết lập thông tin
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(message, true); // Bật chế độ HTML

            // Gửi email
            emailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
}
