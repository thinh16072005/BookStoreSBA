package com.example.backend.controller;

// Xóa các import không cần thiết (JsonNode, ObjectMapper, Date, Instant, ...)

import com.example.backend.dto.FeedbackRequest;
import com.example.backend.service.feedback.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller chỉ làm nhiệm vụ "Lễ tân":
 * 1. Nhận request từ Frontend.
 * 2. Chuyển request cho Service xử lý.
 * 3. Bắt lỗi (nếu Service văng ra) và trả về thông báo.
 */
@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    // Controller bây giờ CHỈ phụ thuộc vào Service
    @Autowired
    private FeedbackService feedbackService;


    @PostMapping("/add-feedback")
    public ResponseEntity<?> add(@RequestBody FeedbackRequest dto) {
        try {
            // Chỉ cần gọi Service. Mọi logic nặng đã được chuyển đi
            feedbackService.addFeedback(dto);

            // Nếu không có lỗi, trả về 200 OK
            return ResponseEntity.ok("Gửi feedback thành công");

        } catch (Exception e) {
            // Nếu Service văng ra lỗi (ví dụ: User không tồn tại)
            // Bắt lỗi đó và trả về cho Frontend
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }


}