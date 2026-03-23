package com.example.backend.dao.favorite;

import com.example.backend.dao.favorite.FavoriteBookRepository;



import com.example.backend.entity.book.Book;
import com.example.backend.entity.favorite.FavoriteBook;
import com.example.backend.entity.user.User;
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
