package com.example.backend.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.Payment;

@RepositoryRestResource(path = "payments")
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
