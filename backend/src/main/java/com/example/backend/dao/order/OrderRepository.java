package com.example.backend.dao.order;

import com.example.backend.dao.order.OrderRepository;


import com.example.backend.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "orders")
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
}
