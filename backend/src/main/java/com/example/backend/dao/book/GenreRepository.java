package com.example.backend.dao.book;

import com.example.backend.dao.book.GenreRepository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.book.Genre;

@RepositoryRestResource(path = "genre")
public interface GenreRepository extends JpaRepository<Genre, Integer> {

}
