package com.example.backend.dao;

// thêm hàm tìm sách chưa đánh giá

import com.example.backend.dto.BookToReviewDTO;
import com.example.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.OrderDetail;

import java.util.List;


@RepositoryRestResource(path = "order-detail")
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {

    List<OrderDetail> findOrderDetailsByOrder(Order order);

    @Query("SELECT DISTINCT od FROM OrderDetail od " +
            "LEFT JOIN FETCH od.book b " +
            "LEFT JOIN FETCH b.listImages " + // Lấy luôn ảnh
            "JOIN FETCH od.order o " +
            "JOIN FETCH o.user u " +
            "WHERE u.idUser = :userId " +
            "AND od.isReview = false " +
            "AND o.status = 'Thành công'")
    List<OrderDetail> findUnreviewedBooksByUser(@Param("userId") int userId);
}