package com.example.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.example.backend.entity.User;

@RepositoryRestResource(excerptProjection = User.class, path = "users")
public interface UserRepository extends JpaRepository<User, Integer> {
    //Tìm kiếm user theo tên đăng nhập
    public boolean existsByUsername(String username);
    //Tìm kiếm user theo email
    public boolean existsByEmail(String email);
    //Tìm kiếm user theo tên đăng nhập
    public User findByUsername(String username);
    //Tìm kiếm user theo email
    public User findByEmail(String email);
}
