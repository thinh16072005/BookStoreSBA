package com.example.backend.service.userSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.example.backend.entity.User;

public interface UserSecurityService extends UserDetailsService {
    // Hàm tìm kiếm user theo tên đăng nhập
    public User findByUsername(String username);
}
