package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.ChangeAvatarDTO;
import com.example.backend.dto.ChangePasswordDTO;
import com.example.backend.dto.EmailDTO;
import com.example.backend.dto.UpdateProfileDTO;
import com.example.backend.entity.User;
import com.example.backend.security.LoginRequest;
import com.example.backend.service.user.UserServiceImp;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserServiceImp userServiceImp;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Validated @RequestBody User user) {
        return userServiceImp.register(user);
    }

    @PostMapping("/add-user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addUserByAdmin(@Validated @RequestBody User user) {
        return userServiceImp.addUserByAdmin(user);
    }

    @PatchMapping("/{id}/update-by-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUserByAdmin(@PathVariable int id, @RequestBody User user) {
        return userServiceImp.updateUserByAdmin(id, user);
    }

    @GetMapping("/active-account")
    public ResponseEntity<?> activeAccount(@RequestParam String email, @RequestParam String activationCode) {
        return userServiceImp.activeAccount(email, activationCode);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate (@RequestBody LoginRequest loginRequest) {
        return userServiceImp.authenticate(loginRequest);
    }

    @PutMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody EmailDTO emailDTO){
        return userServiceImp.forgotPassword(emailDTO.getEmail());
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@Validated @RequestBody UpdateProfileDTO updateProfileDTO){
        return userServiceImp.updateProfile(updateProfileDTO);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Validated @RequestBody ChangePasswordDTO changePasswordDTO){
        return userServiceImp.changePassword(changePasswordDTO);
    }

    @PutMapping("/change-avatar")
    public ResponseEntity<?> changeAvatar(@Validated @RequestBody ChangeAvatarDTO changeAvatarDTO){
        return userServiceImp.changeAvatar(changeAvatarDTO);
    }
}
