package com.example.backend.service.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.service.userSecurity.UserSecurityService;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtService {
    private static final String KEY_SECRET = "MTIzNDU2NDU5OThEMzIxM0F6eGMzNTE2NTQzMjEzMjE2NTQ5OHEzMTNhMnMxZDMyMnp4M2MyMQ==";

    @Autowired
    private UserSecurityService userSecurityService;

    // Tạo jwt dựa trên username (tạo thông tin cần trả về cho FE khi đăng nhập thành công)
    public String generateToken(String username) {
        // Tạo claims (nơi lưu trữ dữ liệu của token)
        Map<String, Object> claims = new HashMap<>();
        // Lấy user từ csdl
        User user = userSecurityService.findByUsername(username);
        // Thêm thông tin vào claims
        claims.put("id", user.getIdUser());
        claims.put("avatar", user.getAvatar());
        claims.put("lastName", user.getLastName());
        claims.put("enabled", user.isEnabled());
        List<Role> roles = user.getListRoles();
        if (roles.size() > 0) {
            for (Role role : roles) {
                // Thêm role vào claims
                if (role.getNameRole().equals("ADMIN")) {
                    claims.put("role", "ADMIN");
                    break;
                }
                if (role.getNameRole().equals("CUSTOMER")) {
                    claims.put("role", "CUSTOMER");
                    break;
                }
            }
        }
        // Tạo token
        return createToken(claims, username);
    }

    // Tạo jwt với các claims đã chọn
    private String createToken(Map<String, Object> claims, String username) {
        return Jwts.builder()
                .setClaims(claims) //Set các thông tin vào claims
                .setSubject(username) //Set tên đăng nhập vào token
                .setIssuedAt(new Date(System.currentTimeMillis())) //Set thời gian tạo token
//              .setExpiration(new Date(System.currentTimeMillis() + 30 * 60 * 1000) ) // Hết hạn sau 30 phút
                .setExpiration(new Date(System.currentTimeMillis() + 100000L * 60 * 60 * 1000) )
                .signWith(SignatureAlgorithm.HS256, getSigneKey()) //Set thuật toán và key
                .compact();
    }

    // Lấy key_secret
    private Key getSigneKey() {
        byte[] keyByte = Decoders.BASE64.decode(KEY_SECRET);
        return Keys.hmacShaKeyFor(keyByte);
    }

    // Trích xuất thông tin (lấy ra tất cả thông số)
    private Claims extractAllClaims(String token) {
        return Jwts.parser().setSigningKey(getSigneKey()).parseClaimsJws(token).getBody();
    }

    // Trích xuất thông tin cụ thể nhưng triển khai tổng quát (Method Generic)
    public <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }

    // Lấy ra thời gian hết hạn
    public Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }

    // Lấy ra username
    public String extractUsername(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    // Kiểm tra token đó hết hạn chưa
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Kiểm tra tính hợp lệ của token
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
