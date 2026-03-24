package com.example.backend.dto.response.favorite;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FavoriteBookDTO {
    private int idUser;
    private int idBook;
}