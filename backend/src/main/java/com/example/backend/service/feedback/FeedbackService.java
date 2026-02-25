package com.example.backend.service.feedback;

import com.example.backend.dto.FeedbackRequest;
import com.example.backend.dto.FeedbackResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Interface (Hợp đồng) cho Feedback Service.
 * Định nghĩa các logic nghiệp vụ liên quan đến Feedback.
 */
public interface FeedbackService {

    // ===== PHƯƠNG THỨC CHO USER =====

    /**
     * Xử lý logic nghiệp vụ để thêm một feedback mới.
     * @param dto Dữ liệu feedback (đã được xác thực) từ Controller.
     * @throws Exception Văng ra lỗi nếu có vấn đề (ví dụ: User không tồn tại).
     */
    void addFeedback(FeedbackRequest dto) throws Exception;


    // ===== CÁC PHƯƠNG THỨC CHO ADMIN =====

    /**
     * [MỚI] Lấy danh sách tất cả feedback, có phân trang, sắp xếp mới nhất.
     * @param pageable Thông tin phân trang (page, size, sort).
     * @return Một trang (Page) chứa danh sách feedback.
     */
    Page<FeedbackResponse> getAllFeedback(Pageable pageable);

    /**
     * Xử lý logic nghiệp vụ để đánh dấu feedback là đã đọc.
     * @param idFeedback ID của feedback cần cập nhật.
     * @throws Exception Văng ra lỗi nếu feedback không tìm thấy.
     */
    void markFeedbackAsRead(int idFeedback) throws Exception;

    /**
     * [MỚI - TÙY CHỌN] Xử lý logic nghiệp vụ để xóa một feedback.
     * @param idFeedback ID của feedback cần xóa.
     * @throws Exception Văng ra lỗi nếu feedback không tìm thấy.
     */
    void deleteFeedback(int idFeedback) throws Exception;

    /**
     * [MỚI] Lấy số lượng feedback chưa đọc (unread).
     * @return Số lượng feedback chưa đọc.
     */
    long getUnreadFeedbackCount();
}