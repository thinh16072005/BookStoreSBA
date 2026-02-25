package com.example.backend.service.feedback;

import com.example.backend.dao.FeedBackRepository;
import com.example.backend.dao.UserRepository;
import com.example.backend.dto.FeedbackRequest;
import com.example.backend.dto.FeedbackResponse;
import com.example.backend.entity.Feedbacks;
import com.example.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class FeedbackServiceImpl implements FeedbackService { // Class này implement interface

    @Autowired
    private FeedBackRepository feedBackRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Triển khai phương thức 1: addFeedback (Code của bạn)
     */
    @Override
    @Transactional // Thêm @Transactional để đảm bảo an toàn dữ liệu
    public void addFeedback(FeedbackRequest dto) throws Exception {
        User user = userRepository.findByUsername(dto.getUser());
        if (user == null) {
            throw new RuntimeException("User không tồn tại: " + dto.getUser());
        }
        java.sql.Date dateCreated = new java.sql.Date(System.currentTimeMillis());
        Feedbacks feedbacks = Feedbacks.builder()
                .title(dto.getTitle())
                .comment(dto.getComment())
                .isReaded(false)
                .dateCreated(dateCreated)
                .user(user).build();
        feedBackRepository.save(feedbacks);
    }

    /**
     * Triển khai phương thức 2: markFeedbackAsRead (Code của bạn)
     */
    @Override
    @Transactional
    public void markFeedbackAsRead(int idFeedback) throws Exception {
        Optional<Feedbacks> feedback = feedBackRepository.findById(idFeedback);
        if (feedback.isPresent()) {
            feedback.get().setReaded(true);
            feedBackRepository.save(feedback.get());
        } else {
            throw new RuntimeException("Không tìm thấy feedback với ID: " + idFeedback);
        }
    }

    /**
     * [MỚI] Triển khai phương thức 3: getAllFeedback (PHẦN CÒN THIẾU)
     * Đây là phương thức mà lỗi đang báo bạn thiếu.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<FeedbackResponse> getAllFeedback(Pageable pageable) {

        Page<Feedbacks> feedbackPage = feedBackRepository.findAll(pageable);

        return feedbackPage.map(feedback -> {
            // Kiểm tra đối tượng user có bị null hay không
            String username = (feedback.getUser() != null)
                    ? feedback.getUser().getUsername()
                    : "N/A_Backend_check_fail"; // <--- Thêm tag để dễ debug

            return FeedbackResponse.builder()
                    .idFeedback(feedback.getIdFeedback())
                    .title(feedback.getTitle())
                    .comment(feedback.getComment())
                    .dateCreated(feedback.getDateCreated())
                    .isReaded(feedback.isReaded())
                    .username(username) // <--- Sử dụng username đã được kiểm tra null
                    .build();
        });
    }

    /**
     * [MỚI] Triển khai phương thức 4: deleteFeedback (PHẦN CÒN THIẾU)
     */
    @Override
    @Transactional
    public void deleteFeedback(int idFeedback) throws Exception {
        if (feedBackRepository.existsById(idFeedback)) {
            feedBackRepository.deleteById(idFeedback);
        } else {
            // Ném ra lỗi để Controller bắt
            throw new RuntimeException("Không tìm thấy feedback với ID: " + idFeedback);
        }
    }

    /**
     * [MỚI] Triển khai phương thức 5: getUnreadFeedbackCount
     */
    @Override
    @Transactional(readOnly = true)
    public long getUnreadFeedbackCount() {
        return feedBackRepository.countByIsReadedFalse();
    }
}