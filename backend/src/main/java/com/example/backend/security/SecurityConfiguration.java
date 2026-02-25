package com.example.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import com.example.backend.service.JWT.JwtFilter;
import com.example.backend.service.userSecurity.UserSecurityService;

import java.util.Arrays;

@Configuration
public class SecurityConfiguration {

    // Cấu hình mã hóa Bcrypt
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    private JwtFilter jwtFilter ;

    // Khi đăng nhập thì sẽ vào hàm này đầu tiên để kiểm tra
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserSecurityService userSecurityService) {
        DaoAuthenticationProvider dap = new DaoAuthenticationProvider();
        // Dùng userSecurityService để load user từ csdl
        dap.setUserDetailsService(userSecurityService);
        // Dùng passwordEncoder để so sánh password
        dap.setPasswordEncoder(passwordEncoder());
        return dap;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Cấu hình phân quyền cho endpoint
        http.authorizeHttpRequests(
                config -> config
                        .requestMatchers(HttpMethod.GET, Endpoints.PUBLIC_GET).permitAll()
                        .requestMatchers(HttpMethod.POST, Endpoints.PUBLIC_POST).permitAll()
                        .requestMatchers(HttpMethod.PUT, Endpoints.PUBLIC_PUT).permitAll()
                        .requestMatchers(HttpMethod.DELETE, Endpoints.PUBLIC_DELETE).permitAll()
                        .requestMatchers(HttpMethod.POST, Endpoints.CUSTOMER_ENDPOINT).hasAuthority("CUSTOMER")
                        .requestMatchers(HttpMethod.PATCH, Endpoints.ADMIN_ENDPOINT).hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.GET, Endpoints.ADMIN_ENDPOINT).hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.POST, Endpoints.ADMIN_ENDPOINT).hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.PUT, Endpoints.ADMIN_ENDPOINT).hasAuthority("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, Endpoints.ADMIN_ENDPOINT).hasAuthority("ADMIN")
                        .anyRequest().authenticated());
        // Cấu hình cors
        http.cors(cors -> {
            // Cấu hình cho mỗi request
            cors.configurationSource(request -> {
                CorsConfiguration corsConfig = new CorsConfiguration();

                // Cho phép tất cả các domain gọi API.
                corsConfig.addAllowedOrigin("*");

                // Cho phép tất cả các phương thức HTTP.
                corsConfig.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));

                // Cho phép tất cả các header.
                corsConfig.addAllowedHeader("*");
                return corsConfig;
            });
        });

        // Thêm filter JWT vào filter chain trước filter xác thực
        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Cấu hình không tạo session
        http.sessionManagement((session) -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Bật chế độ xác thực bằng username/password qua popup trình duyệt
        http.httpBasic(Customizer.withDefaults());

        // Cấu hình không kiểm tra csrf
        http.csrf(csrf -> csrf.disable());
        return http.build();
    }

    // AuthenticationManager sử dụng DaoAuthenticationProvider để xác thực thông qua
    // userSecurityService
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
