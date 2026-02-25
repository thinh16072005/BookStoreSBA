package com.example.backend.service.JWT;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.backend.service.userSecurity.UserSecurityService;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserSecurityService userSecurityService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        try{
            //Lấy token từ header
            String authHeader = request.getHeader("Authorization");
            String token = null;
            String username = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
                username = jwtService.extractUsername(token);
            }
            // Kiểm tra token
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                //Lấy user từ csdl
                UserDetails userDetails = userSecurityService.loadUserByUsername(username);
                // Kiểm tra token
                if (jwtService.validateToken(token, userDetails)) {
                    // Tạo authentication
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                    // Set details với các thông tin như : IP, request, ...
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // Set authentication
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
            //Tiếp tục filter
            filterChain.doFilter(request, response);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
