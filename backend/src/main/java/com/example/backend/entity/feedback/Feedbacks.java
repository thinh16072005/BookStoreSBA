package com.example.backend.entity.feedback;

import com.example.backend.entity.user.User;
import com.example.backend.entity.feedback.Feedbacks;


import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "feedback")
public class Feedbacks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_feedback")
    private int idFeedback; //mã phản hồi
    @Column(name = "title", columnDefinition = "NVARCHAR(255)")
    private String title; //tiêu đề phản hồi 
    @Column(name = "comment", columnDefinition = "NVARCHAR(255)")
    private String comment; //nội dung phản hồi
    @Column(name = "dateCreated")
    private Date dateCreated; //ngày tạo phản hồi
    @Column(name = "isReaded")
    private boolean isReaded; //đã đọc phản hồi chưa

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "id_user", nullable = false)
    private User user; //người dùng

    @Override
    public String toString() {
        return "Feedbacks{" +
                "idFeedback=" + idFeedback +
                ", title='" + title + '\'' +
                ", comment='" + comment + '\'' +
                ", dateCreated=" + dateCreated +
                ", isReaded=" + isReaded +
                '}';
    }
}
