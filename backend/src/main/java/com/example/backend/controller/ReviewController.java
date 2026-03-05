package com.example.backend.controller;

import com.example.backend.dto.BookToReviewDTO;
import com.example.backend.service.review.ReviewService;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // API: Lấy danh sách chờ đánh giá
    // [SỬA LỖI] Đổi ResponseEntityList thành ResponseEntity<List<...>>
    @GetMapping("/books-to-review/{userId}")
    public ResponseEntity<List<BookToReviewDTO>> getBooksToReview(@PathVariable int userId) {
        return ResponseEntity.ok(reviewService.getBooksToReview(userId));
    }

    // API: Gửi đánh giá mới
    @PostMapping("/submit-new")
    public ResponseEntity<?> submitReview(@RequestBody JsonNode jsonNode) {
        return reviewService.submitReview(jsonNode);
    }
}
// tuanuser - pass : tuan123456
// API để Frontend gọi
