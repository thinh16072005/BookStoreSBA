package com.example.backend.service.cart;

import com.example.backend.dao.book.BookRepository;
import com.example.backend.dao.cart.CartItemRepository;
import com.example.backend.dao.user.UserRepository;
import com.example.backend.dto.response.cart.CartItemDTO;
import com.example.backend.entity.book.Book;
import com.example.backend.entity.cart.CartItem;
import com.example.backend.entity.notification.Notification;
import com.example.backend.entity.user.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CartServiceImp implements CartService {
    @Autowired
    public UserRepository userRepository;
    @Autowired
    public CartItemRepository cartItemRepository;
    @Autowired
    public BookRepository bookRepository;
    

    // Thêm sản phẩm vào giỏ hàng
    @Override
    public ResponseEntity<?> save(CartItemDTO cartItemDTO) {
        // Kiểm tra xem user và sách có tồn tại không
        Optional<User> user = userRepository.findById(cartItemDTO.getIdUser());
        Optional<Book> book = bookRepository.findById(cartItemDTO.getIdBook());
        if(user.isPresent() && book.isPresent()) {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user.get()); // Set user
            cartItem.setBook(book.get()); // Set sách
            cartItem.setQuantity(cartItemDTO.getQuantity()); // Set số lượng
            cartItemRepository.save(cartItem);
            return ResponseEntity.ok("Đã thêm sản phẩm vào giỏ hàng");
        }
        return ResponseEntity.badRequest().body("Đã xảy ra lỗi");
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    @Override
    public ResponseEntity<?> updateQuantity(int idCart, CartItemDTO cartItemDTO) {
        Optional<CartItem> cartItem = cartItemRepository.findById(idCart);
        if(cartItem.isPresent()) {
            cartItem.get().setQuantity(cartItemDTO.getQuantity());
            cartItemRepository.save(cartItem.get());
            return ResponseEntity.ok(new Notification("Đã cập nhật số lượng sản phẩm trong giỏ hàng"));
        }
        return ResponseEntity.badRequest().build();
    }
}
