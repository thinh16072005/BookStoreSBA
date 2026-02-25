package com.example.backend.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.backend.entity.Book;

@RepositoryRestResource(path = "books")
public interface BookRepository extends JpaRepository<Book, Integer> {
    //Tìm kiếm sách theo tên sách
    Page<Book> findByNameBookContaining(@RequestParam("nameBook") String nameBook, Pageable pageable);
    //Tìm kiếm sách theo thể loại
    Page<Book> findByListGenres_idGenre(@RequestParam("idGenre") int idGenre, Pageable pageable);
    //Tìm kiếm sách theo tên sách và thể loại
    Page<Book> findByNameBookContainingAndListGenres_idGenre(@RequestParam("nameBook") String nameBook ,@RequestParam("idGenre") int idGenre, Pageable pageable);
}