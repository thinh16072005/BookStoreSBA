package com.example.backend.controller.book;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.book.GenreRepository;
import com.example.backend.dao.book.ImageRepository;
import com.example.backend.entity.book.Image;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.book.Genre;
import com.example.backend.dto.response.book.BookDTO;
import com.example.backend.service.UploadImage.UploadImageService;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/books")
public class BookController {
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UploadImageService uploadImageService;

    @Autowired
    private GenreRepository genreRepository;

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

    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBook(
            @RequestParam("nameBook") String nameBook,
            @RequestParam("author") String author,
            @RequestParam("listPrice") double listPrice,
            @RequestParam("quantity") int quantity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "discountPercent", defaultValue = "0") int discountPercent,
            @RequestParam("genreIds") List<Integer> genreIds,  // Thay đổi từ genreId sang genreIds
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            System.out.println("===== CREATE BOOK =====");
            System.out.println("Tên: " + nameBook);
            System.out.println("Tác giả: " + author);
            System.out.println("Giá niêm yết: " + listPrice);
            System.out.println("Số lượng: " + quantity);
            System.out.println("Genre IDs: " + genreIds);
            System.out.println("Số ảnh: " + (images != null ? images.size() : 0));

            // Validation
            if (nameBook == null || nameBook.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Tên sách không được để trống!");
            }
            if (listPrice <= 0) {
                return ResponseEntity.badRequest().body("Giá niêm yết phải lớn hơn 0!");
            }
            if (genreIds == null || genreIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một thể loại!");
            }

            // Kiểm tra và lấy danh sách Genre
            List<Genre> genres = new ArrayList<>();
            for (Integer genreId : genreIds) {
                Optional<Genre> genreOpt = genreRepository.findById(genreId);
                if (genreOpt.isPresent()) {
                    genres.add(genreOpt.get());
                    System.out.println("Tìm thấy thể loại: " + genreOpt.get().getNameGenre());
                } else {
                    return ResponseEntity.badRequest().body("Không tìm thấy thể loại ID: " + genreId);
                }
            }

            // Tạo sách mới
            Book book = new Book();
            book.setNameBook(nameBook);
            book.setAuthor(author);
            book.setDescription(description);
            book.setListPrice(listPrice);
            book.setQuantity(quantity);
            book.setDiscountPercent(discountPercent);
            book.setAvgRating(0.0);
            book.setSoldQuantity(0);

            // Tính giá bán
            double sellPrice = listPrice - (listPrice * discountPercent / 100);
            book.setSellPrice(sellPrice);

            // Thiết lập danh sách thể loại cho sách
            book.setGenres(genres);

            // Lưu sách
            Book savedBook = bookRepository.save(book);
            System.out.println("Đã lưu sách với ID: " + savedBook.getIdBook());

            // Upload và lưu ảnh (nếu có)
            if (images != null && !images.isEmpty()) {
                for (int i = 0; i < images.size(); i++) {
                    MultipartFile imageFile = images.get(i);

                    if (!imageFile.isEmpty()) {
                        // Upload lên Cloudinary
                        String imageName = "Book_" + savedBook.getIdBook() + "_" + i + "_" + System.currentTimeMillis();
                        String imageUrl = uploadImageService.uploadImage(imageFile, imageName);

                        if (imageUrl != null && !imageUrl.isEmpty()) {
                            // Lưu thông tin ảnh vào database
                            Image image = new Image();
                            image.setBook(savedBook);
                            image.setNameImage(imageFile.getOriginalFilename());
                            image.setUrlImage(imageUrl);
                            image.setThumbnail(i == 0); // Ảnh đầu tiên là thumbnail

                            imageRepository.save(image);
                        }
                    }
                }
            }

            return ResponseEntity.ok(savedBook);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Lỗi khi tạo sách: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBook(
            @RequestParam("idBook") int idBook,
            @RequestParam("nameBook") String nameBook,
            @RequestParam("author") String author,
            @RequestParam("listPrice") double listPrice,
            @RequestParam("quantity") int quantity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "discountPercent", defaultValue = "0") int discountPercent,
            @RequestParam("genreIds") List<Integer> genreIds  // Thay đổi từ genreId sang genreIds
    ) {
        try {
            System.out.println("\n===== UPDATE BOOK =====");
            System.out.println("ID: " + idBook);
            System.out.println("Tên: " + nameBook);
            System.out.println("Tác giả: " + author);
            System.out.println("Giá niêm yết: " + listPrice);
            System.out.println("Số lượng: " + quantity);
            System.out.println("Genre IDs: " + genreIds);

            // Tìm sách theo ID
            Book existingBook = bookRepository.findById(idBook)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + idBook));

            // Validation
            if (genreIds == null || genreIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một thể loại!");
            }

            // Cập nhật thông tin
            existingBook.setNameBook(nameBook);
            existingBook.setAuthor(author);
            existingBook.setDescription(description);
            existingBook.setListPrice(listPrice);
            existingBook.setQuantity(quantity);
            existingBook.setDiscountPercent(discountPercent);

            // Tính giá bán
            double sellPrice = listPrice - (listPrice * discountPercent / 100);
            existingBook.setSellPrice(sellPrice);

            // Cập nhật danh sách thể loại
            List<Genre> genres = new ArrayList<>();
            for (Integer genreId : genreIds) {
                Optional<Genre> genreOpt = genreRepository.findById(genreId);
                if (genreOpt.isPresent()) {
                    genres.add(genreOpt.get());
                    System.out.println("Đã thêm thể loại: " + genreOpt.get().getNameGenre());
                } else {
                    return ResponseEntity.badRequest().body("Không tìm thấy thể loại ID: " + genreId);
                }
            }
            existingBook.setGenres(genres);

            // Lưu vào database
            Book updatedBook = bookRepository.save(existingBook);

            return ResponseEntity.ok(updatedBook);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi cập nhật sách: " + e.getMessage());
        }
    }

    @PutMapping(value = "/update-with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBookWithImages(
            @RequestParam("idBook") int idBook,
            @RequestParam("nameBook") String nameBook,
            @RequestParam("author") String author,
            @RequestParam("listPrice") double listPrice,
            @RequestParam("quantity") int quantity,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "discountPercent", defaultValue = "0") int discountPercent,
            @RequestParam("genreIds") List<Integer> genreIds,  // Thay đổi từ idGenre sang genreIds
            @RequestParam(value = "keepImageIds", required = false) List<Integer> keepImageIds,
            @RequestPart(value = "newImages", required = false) List<MultipartFile> newImages
    ) {
        try {
            System.out.println("\n===== UPDATE BOOK WITH IMAGES =====");
            System.out.println("ID: " + idBook);
            System.out.println("Tên: " + nameBook);
            System.out.println("Genre IDs: " + genreIds);
            System.out.println("Giữ ảnh IDs: " + keepImageIds);
            System.out.println("Ảnh mới: " + (newImages != null ? newImages.size() : 0));

            // Tìm sách
            Book existingBook = bookRepository.findById(idBook)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));

            // Validation
            if (genreIds == null || genreIds.isEmpty()) {
                return ResponseEntity.badRequest().body("Vui lòng chọn ít nhất một thể loại!");
            }

            // Cập nhật thông tin
            existingBook.setNameBook(nameBook);
            existingBook.setAuthor(author);
            existingBook.setDescription(description);
            existingBook.setListPrice(listPrice);
            existingBook.setQuantity(quantity);
            existingBook.setDiscountPercent(discountPercent);

            double sellPrice = listPrice - (listPrice * discountPercent / 100);
            existingBook.setSellPrice(sellPrice);

            // Cập nhật danh sách thể loại
            List<Genre> genres = new ArrayList<>();
            for (Integer genreId : genreIds) {
                Optional<Genre> genreOpt = genreRepository.findById(genreId);
                if (genreOpt.isPresent()) {
                    genres.add(genreOpt.get());
                    System.out.println("Đã thêm thể loại: " + genreOpt.get().getNameGenre());
                } else {
                    return ResponseEntity.badRequest().body("Không tìm thấy thể loại ID: " + genreId);
                }
            }
            existingBook.setGenres(genres);

            bookRepository.save(existingBook);
            System.out.println("Cập nhật thông tin sách");

            // Xử lý ảnh
            List<Image> currentImages = imageRepository.findByBook_IdBook(idBook);

            // Xóa ảnh không còn trong danh sách keep
            if (keepImageIds != null) {
                for (Image image : currentImages) {
                    if (!keepImageIds.contains(image.getIdImage())) {
                        System.out.println("Xóa ảnh ID: " + image.getIdImage());
                        imageRepository.delete(image);
                    }
                }
            } else {
                // Xóa tất cả ảnh cũ
                imageRepository.deleteAll(currentImages);
            }

            // Thêm ảnh mới
            if (newImages != null && !newImages.isEmpty()) {
                System.out.println("Upload " + newImages.size() + " ảnh mới");

                int keepCount = keepImageIds != null ? keepImageIds.size() : 0;

                for (int i = 0; i < newImages.size(); i++) {
                    MultipartFile file = newImages.get(i);

                    if (!file.isEmpty()) {
                        String imageName = "Book_" + idBook + "_" + System.currentTimeMillis() + "_" + i;
                        String imageUrl = uploadImageService.uploadImage(file, imageName);

                        if (imageUrl != null) {
                            Image image = new Image();
                            image.setBook(existingBook);
                            image.setNameImage(file.getOriginalFilename());
                            image.setUrlImage(imageUrl);
                            image.setThumbnail(keepCount == 0 && i == 0);

                            imageRepository.save(image);
                            System.out.println("Lưu ảnh: " + imageUrl);
                        }
                    }
                }
            }

            System.out.println("Hoàn tất\n");
            return ResponseEntity.ok(existingBook);

        } catch (Exception e) {
            System.err.println("Lỗi:");
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete-by-id/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable int id) {
        try {

            // Tìm sách theo ID
            Book existingBook = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với ID: " + id));

            System.out.println("Tìm thấy sách: " + existingBook.getNameBook());

            // Xóa sách
            bookRepository.delete(existingBook);

            // Trả về response thành công
            return ResponseEntity.ok("Xóa sách thành công!");

        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Không thể xóa sách này vì đã có trong giỏ hàng.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi xóa sách: " + e.getMessage());
        }
    }
}
