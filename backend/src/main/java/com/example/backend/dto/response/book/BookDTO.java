package com.example.backend.dto.response.book;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class BookDTO {
    private int idBook;
    private String title;
}
