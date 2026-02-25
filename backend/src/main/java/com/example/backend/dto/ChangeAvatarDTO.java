package com.example.backend.dto;

import lombok.Data;

@Data
public class ChangeAvatarDTO {
    private int idUser;
    private String avatar; // Base64 string của ảnh

    public ChangeAvatarDTO() {}
}

