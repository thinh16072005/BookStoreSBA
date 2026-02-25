package com.example.backend.security;

public class Endpoints {

    public static final String font_end_host = "http://localhost:3000";

    // Phương thức GET không cần xác thực
    public static final String[] PUBLIC_GET = {
            "/books",
            "/books/**",
            "/users/**",
            "/user/active-account",
            "/genre/**",
            "/images/**",
            "/feedbacks/**",
            "/feedbacks",
            "/favorite-book/**",
            "/favorite-books/**",
    };

    // Phương thức POST không cần xác thực
    public static final String[] PUBLIC_POST = {
            "/user/register",
            "/user/authenticate",
            "/favorite-book/**",
    };

    // Phương thức PUT không cần xác thực
    public static final String[] PUBLIC_PUT = {
            "/user/forgot-password",
    };

    // Phương thức DELETE không cần xác thực
    public static final String[] PUBLIC_DELETE = {
            "/favorite-book/**",
    };

    // Phương thức ADMIN_ENDPOINT cần xác thực quyền ADMIN
    // Các endpoint này chỉ cho phép người dùng có role ADMIN truy cập
    // Frontend phải gửi kèm JWT token trong header Authorization để xác thực
    public static final String[] ADMIN_ENDPOINT = {
            "/feedbacks/**",
            "/feedbacks"

    };

    // Phương thức CUSTOMER_ENDPOINT cần xác thực quyền CUSTOMER
    public static final String[] CUSTOMER_ENDPOINT = {
            "/feedback/add-feedback"
    };
}