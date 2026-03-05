package com.example.backend.dao;

import com.example.backend.entity.Book;
import com.example.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "reviews")
public interface ReviewRepository extends JpaRepository<Review, Long> {

    // [THÊM MỚI] Hàm này để tìm review theo sách (hiệu quả hơn)
    List<Review> findByBook(Book book);
}