package com.example.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.Delivery;

@RepositoryRestResource(path = "deliveries")
public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {
    
}
