package com.example.backend.dao;

// Thêm 2 import này

import com.example.backend.entity.Feedbacks;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;


@RepositoryRestResource(path = "feedbacks")
public interface FeedBackRepository extends JpaRepository<Feedbacks, Integer> {

    // THÊM 2 PHƯƠNG THỨC NÀY VÀO:

    /**
     * Lấy feedback có phân trang, sắp xếp theo ngày tạo mới nhất
     */

    @EntityGraph(attributePaths = {"user"})
    Page<Feedbacks> findAll(Pageable pageable);

    /**
     * Lấy feedback có phân trang, lọc theo trạng thái, sắp xếp theo ngày tạo mới nhất
     * (Dùng nếu admin muốn lọc feedback 'Chưa đọc' / 'Đã đọc')
     */
    Page<Feedbacks> findByIsReadedOrderByDateCreatedDesc(boolean isReaded, Pageable pageable);

    /**
     * Đếm số lượng feedback chưa đọc
     */
    long countByIsReadedFalse();

}