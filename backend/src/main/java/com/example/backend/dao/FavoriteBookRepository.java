package com.example.backend.dao;


import com.example.backend.entity.Book;
import com.example.backend.entity.FavoriteBook;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;


@RepositoryRestResource(path = "favorite-books")
public interface FavoriteBookRepository extends JpaRepository<FavoriteBook, Integer> {
    //Tìm favorite book theo book và user
    public FavoriteBook findFavoriteBookByBookAndUser(Book book, User user);

    //Tìm tất cả favorite book theo user
    public List<FavoriteBook> findFavoriteBooksByUser(User user);
}
