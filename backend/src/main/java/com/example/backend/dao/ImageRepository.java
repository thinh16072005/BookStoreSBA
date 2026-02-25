package com.example.backend.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.Image;


@RepositoryRestResource(path = "images")
public interface ImageRepository extends JpaRepository<Image, Integer> {
    List<Image> findByBook_IdBook(int bookId);
}
