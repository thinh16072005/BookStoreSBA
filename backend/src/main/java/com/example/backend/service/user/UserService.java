package com.example.backend.service.user;
import com.example.backend.dto.ChangeAvatarDTO;
import com.example.backend.dto.ChangePasswordDTO;
import com.example.backend.dto.UpdateProfileDTO;
import com.example.backend.entity.User;
import com.example.backend.security.LoginRequest;

import org.springframework.http.ResponseEntity;

public interface UserService {
    public ResponseEntity<?> register(User user);
    public ResponseEntity<?> addUserByAdmin(User user);
    public ResponseEntity<?> updateUserByAdmin(int userId, User updateData);
    public ResponseEntity<?> authenticate(LoginRequest loginRequest);
    public ResponseEntity<?> forgotPassword(String email);
    public ResponseEntity<?> updateProfile(UpdateProfileDTO updateProfileDTO);
    public ResponseEntity<?> changePassword(ChangePasswordDTO changePasswordDTO);
    public ResponseEntity<?> changeAvatar(ChangeAvatarDTO changeAvatarDTO);

}
