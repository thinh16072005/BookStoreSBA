package com.example.backend.service.review;

import com.example.backend.dto.BookToReviewDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ReviewService {
    // Lấy danh sách sách cần đánh giá
    List<BookToReviewDTO> getBooksToReview(int userId);

    // Gửi đánh giá
    ResponseEntity<?> submitReview(JsonNode jsonNode);
}
