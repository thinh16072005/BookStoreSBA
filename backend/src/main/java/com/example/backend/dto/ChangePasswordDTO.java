package com.example.backend.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private int idUser;
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;

    public ChangePasswordDTO() {}
}


