package com.example.backend.service.order;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.example.backend.dao.BookRepository;
import com.example.backend.dao.CartItemRepository;
import com.example.backend.dao.DeliveryRepository;
import com.example.backend.dao.OrderDetailRepository;
import com.example.backend.dao.OrderRepository;
import com.example.backend.dao.PaymentRepository;
import com.example.backend.dao.UserRepository;
import com.example.backend.dto.OrderDTO;
import com.example.backend.entity.Book;
import com.example.backend.entity.Delivery;
import com.example.backend.entity.Notification;
import com.example.backend.entity.Order;
import com.example.backend.entity.OrderDetail;
import com.example.backend.entity.Payment;
import com.example.backend.entity.User;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Override
    public ResponseEntity<?> save(OrderDTO orderDTO) {
        try {
            User user = null;
            Payment payment = null;

            // Tìm kiếm người dùng
            if (userRepository.findById(orderDTO.getIdUser()).isPresent()) {
                user = userRepository.findById(orderDTO.getIdUser()).get();
            }

            // Tìm kiếm hình thức thanh toán
            if (paymentRepository.findById(orderDTO.getIdPayment()).isPresent()) {
                payment = paymentRepository.findById(orderDTO.getIdPayment()).get();
            }

            // Tìm kiếm hình thức giao hàng
            Delivery delivery = deliveryRepository.findById(1).get();

            // Xử lý danh sách order items (idBook, quantity)
            if (orderDTO.getOrderItems() != null && !orderDTO.getOrderItems().isEmpty()) {
                // Kiểm tra tất cả sách có đủ số lượng trước khi tạo đơn hàng
                for (OrderDTO.OrderItemRequest item : orderDTO.getOrderItems()) {
                    int idBook = item.getIdBook();
                    int quantity = item.getQuantity();
                    Book book = bookRepository.findById(idBook).get();
                    
                    if (book.getQuantity() < quantity) {
                        return ResponseEntity.badRequest().body(new Notification("Số lượng sách không đủ"));
                    }
                }
                
                // Tạo đơn hàng
                if (user != null && payment != null) {
                    Order order = new Order();
                    LocalDate localDate = LocalDate.now();
                    order.setDateCreated(Date.valueOf(localDate));
                    order.setDeliveryAddress(orderDTO.getDeliveryAddress());
                    order.setPhoneNumber(orderDTO.getPhoneNumber());
                    order.setFullName(orderDTO.getFullName());
                    order.setTotalPriceProduct(orderDTO.getTotalPriceProduct());
                    order.setFeeDelivery(delivery.getFeeDelivery());
                    order.setFeePayment(payment.getFeePayment());
                    order.setTotalPrice(orderDTO.getTotalPrice());
                    order.setNote(orderDTO.getNote());
                    order.setUser(user);
                    order.setPayment(payment);
                    order.setDelivery(delivery);
                    order.setStatus("Đang xử lý");
                    order.setPaymentStatus(orderDTO.getPaymentStatus());

                    // Lưu đơn hàng
                    Order savedOrder = orderRepository.save(order);

                    // Xử lý từng item: cập nhật số lượng sách và tạo OrderDetail
                    for (OrderDTO.OrderItemRequest item : orderDTO.getOrderItems()) {
                        int idBook = item.getIdBook();
                        int quantity = item.getQuantity();
                        Book book = bookRepository.findById(idBook).get();

                        // Cập nhật số lượng sách
                        book.setQuantity(book.getQuantity() - quantity);
                        book.setSoldQuantity(book.getSoldQuantity() + quantity);
                        bookRepository.save(book);

                        // Tạo OrderDetail
                        OrderDetail orderDetail = new OrderDetail();
                        orderDetail.setQuantity(quantity);
                        orderDetail.setPrice(book.getSellPrice());
                        orderDetail.setBook(book);
                        orderDetail.setOrder(savedOrder);
                        orderDetailRepository.save(orderDetail);
                    }

                    cartItemRepository.deleteByUser_IdUser(orderDTO.getIdUser());
                    return ResponseEntity.ok("Đơn hàng đã được tạo thành công!");
                } else {
                    return ResponseEntity.badRequest().build();
                }
            } else {
                return ResponseEntity.badRequest().body(new Notification("Danh sách sách không được trống"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new Notification("Xảy ra lỗi khi tạo đơn hàng"));
        }
    }

    @Override
    public ResponseEntity<?> update(OrderDTO orderDTO) {
        try {
            Order order = orderRepository.findById(orderDTO.getIdOrder()).get();

            // Nếu chuyển sang trạng thái hủy → hoàn kho
           if ("Bị huỷ".equalsIgnoreCase(orderDTO.getStatus()) && 
               !"Bị huỷ".equalsIgnoreCase(order.getStatus())) {
               List<OrderDetail> orderDetails = orderDetailRepository.findOrderDetailsByOrder(order);
               for (OrderDetail detail : orderDetails) {
                   Book book = detail.getBook();
                   if (book != null) {
                       book.setQuantity(book.getQuantity() + detail.getQuantity());
                       book.setSoldQuantity(Math.max(0, book.getSoldQuantity() - detail.getQuantity()));
                       bookRepository.save(book);
                   }
               }
           }

            order.setStatus(orderDTO.getStatus());
            orderRepository.save(order);
            return ResponseEntity.ok(new Notification("Đơn hàng đã được cập nhật thành công"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
