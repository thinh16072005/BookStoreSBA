package com.example.backend.service.review;

import com.example.backend.dao.BookRepository;
import com.example.backend.dao.OrderDetailRepository;
import com.example.backend.dao.ReviewRepository;
import com.example.backend.dao.UserRepository;
import com.example.backend.dto.BookToReviewDTO;
import com.example.backend.entity.Book;
import com.example.backend.entity.Image;
import com.example.backend.entity.OrderDetail;
import com.example.backend.entity.Review;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewServiceImp implements ReviewService {

    @Autowired
    private OrderDetailRepository orderDetailRepository;
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<BookToReviewDTO> getBooksToReview(int userId) {
        List<OrderDetail> listEntities = orderDetailRepository.findUnreviewedBooksByUser(userId);
        List<BookToReviewDTO> listDTOs = new ArrayList<>();

        for (OrderDetail od : listEntities) {
            String imgUrl = "https://via.placeholder.com/150";
            if (od.getBook() != null && od.getBook().getListImages() != null && !od.getBook().getListImages().isEmpty()) {
                imgUrl = od.getBook().getListImages().stream()
                        .filter(img -> img != null && img.isThumbnail())
                        .findFirst()
                        .map(Image::getUrlImage)
                        .orElse(od.getBook().getListImages().get(0) != null ? od.getBook().getListImages().get(0).getUrlImage() : imgUrl);
            }

            // Lấy thông tin an toàn (tránh NullPointerException)
            String bookName = (od.getBook() != null) ? od.getBook().getNameBook() : "Sách Lỗi";
            String author = (od.getBook() != null) ? od.getBook().getAuthor() : "Lỗi";
            int orderId = (od.getOrder() != null) ? od.getOrder().getIdOrder() : 0;

            // [SỬA LỖI 1] Chuyển Date thành String (có kiểm tra null)
            String dateString = (od.getOrder() != null && od.getOrder().getDateCreated() != null)
                    ? od.getOrder().getDateCreated().toString()
                    : "N/A";

            listDTOs.add(new BookToReviewDTO(
                    od.getIdOrderDetail(),
                    bookName,
                    author,
                    imgUrl,
                    orderId,
                    dateString // Đã là String, khớp với DTO
            ));
        }
        return listDTOs;
    }

    @Override
    @Transactional
    public ResponseEntity<?> submitReview(JsonNode jsonNode) {
        try {
            long idOrderDetail = Long.parseLong(formatStringByJson(String.valueOf(jsonNode.get("idOrderDetail"))));
            float ratingPoint = Float.parseFloat(formatStringByJson(String.valueOf(jsonNode.get("ratingPoint"))));
            String content = formatStringByJson(String.valueOf(jsonNode.get("content")));

            OrderDetail od = orderDetailRepository.findById(idOrderDetail)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

            Review review = new Review();
            review.setContent(content);
            review.setRatingPoint(ratingPoint);
            review.setTimestamp(Timestamp.from(Instant.now()));
            review.setBook(od.getBook());
            review.setUser(od.getOrder().getUser());
            review.setOrderDetail(od);
            reviewRepository.save(review);

            od.setReview(true);
            orderDetailRepository.save(od);

            updateBookRating(od.getBook());
            return ResponseEntity.ok("Đánh giá thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    private void updateBookRating(Book book) {
        if (book == null) return;
        List<Review> reviews = reviewRepository.findByBook(book);
        if (reviews.isEmpty()) {
            book.setAvgRating(0);
        } else {
            double sum = 0;
            for (Review r : reviews) {
                sum += r.getRatingPoint();
            }
            book.setAvgRating(sum / reviews.size());
        }
        bookRepository.save(book);
    }

    // [SỬA LỖI 2] Thêm lại hàm formatStringByJson
    private String formatStringByJson(String json) {
        return json.replaceAll("\"", "");
    }
}