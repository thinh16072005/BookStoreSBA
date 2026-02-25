package com.example.backend.controller;

import com.example.backend.dao.BookRepository;
import com.example.backend.dao.FavoriteBookRepository;
import com.example.backend.dao.UserRepository;
import com.example.backend.dto.FavoriteBookDTO;
import com.example.backend.entity.Book;
import com.example.backend.entity.FavoriteBook;
import com.example.backend.entity.Notification;
import com.example.backend.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/favorite-book")
public class FavoriteBookController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FavoriteBookRepository favoriteBookRepository;
    @Autowired
    private BookRepository bookRepository;

    // Lấy danh sách sách yêu thích của người dùng
    @GetMapping("/get-favorite-book/{idUser}")
    public ResponseEntity<?> getAllFavoriteBookByIdUser(@PathVariable Integer idUser) {
        try {
            User user = userRepository.findById(idUser).get();
            List<FavoriteBook> favoriteBookList = favoriteBookRepository.findFavoriteBooksByUser(user);
            List<Integer> idBookListOfFavoriteBook = new ArrayList<>();
            for (FavoriteBook favoriteBook : favoriteBookList) {
                idBookListOfFavoriteBook.add(favoriteBook.getBook().getIdBook());
            }
            return ResponseEntity.ok().body(idBookListOfFavoriteBook);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.badRequest().build();
    }

    // Thêm sách vào danh sách yêu thích
    @PostMapping("/add-book")
    public ResponseEntity<?> addFavoriteBook(@RequestBody FavoriteBookDTO request) {
        try {

            // Tìm Book và User
            Book book = bookRepository.findById(request.getIdBook())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
            User user = userRepository.findById(request.getIdUser())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

            // Kiểm tra sách đã có trong danh sách yêu thích chưa
            List<FavoriteBook> existingFavorites = favoriteBookRepository.findFavoriteBooksByUser(user);

            // So sánh từng sách trong danh sách yêu thích , nếu đã có thì trả về thông báo
            // đã có trong danh sách
            for (FavoriteBook fb : existingFavorites) {
                if (fb.getBook().getIdBook() == request.getIdBook()) {
                    return ResponseEntity.badRequest().body("Sách đã tồn tại trong danh sách yêu thích");
                }
            }

            // Tạo FavoriteBook mới
            FavoriteBook favoriteBook = FavoriteBook.builder()
                    .book(book)
                    .user(user)
                    .build();

            // Lưu vào database
            FavoriteBook saved = favoriteBookRepository.save(favoriteBook);

            return ResponseEntity.ok().body(saved.getIdFavoriteBook());

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().build();
        } catch (Exception e) {

            return ResponseEntity.badRequest().build();
        }
    }

    // Xóa sách khỏi danh sách yêu thích
    @DeleteMapping("/remove-book")
    public ResponseEntity<?> removeFavoriteBook(@RequestBody FavoriteBookDTO request) {
        try {
            // Tìm User
            User user = userRepository.findById(request.getIdUser())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            // Tìm danh sách FavoriteBook của User
            List<FavoriteBook> favoriteBooks = favoriteBookRepository.findFavoriteBooksByUser(user);
            // Tìm và xóa FavoriteBook tương ứng với idBook
            for (FavoriteBook fb : favoriteBooks) {
                if (fb.getBook().getIdBook() == request.getIdBook()) {
                    favoriteBookRepository.delete(fb);
                    // Trả về phản hồi thành công
                return ResponseEntity.ok().body(new Notification("Xóa sách khỏi danh sách yêu thích thành công"));
            }
        }
        return ResponseEntity.badRequest().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}