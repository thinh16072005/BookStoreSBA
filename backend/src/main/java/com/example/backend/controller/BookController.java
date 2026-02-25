package com.example.backend.controller;

import com.example.backend.dao.BookRepository;

import com.example.backend.entity.Book;
import com.example.backend.dto.BookDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    // Lấy danh sách tất cả sách
    @GetMapping("/get-all")
    public ResponseEntity<?> getAllBooks() {
        try {
            List<Book> bookList = bookRepository.findAll();
            List<BookDTO> bookDTOList = new ArrayList<>();
            for (Book book : bookList) {
                BookDTO bookDTO = new BookDTO(book.getIdBook(), book.getNameBook());
                bookDTOList.add(bookDTO);
            }
            return ResponseEntity.ok().body(bookDTOList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.badRequest().build();
    }

}
