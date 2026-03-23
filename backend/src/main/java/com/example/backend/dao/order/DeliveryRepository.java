package com.example.backend.dao.order;

import com.example.backend.dao.order.DeliveryRepository;


import com.example.backend.entity.order.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "deliveries")
public interface DeliveryRepository extends JpaRepository<Delivery, Integer> {
    
}
