package com.example.backend.dao.coupon;

import com.example.backend.dao.coupon.CouponRepository;


import com.example.backend.entity.coupon.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "coupons")
public interface CouponRepository extends JpaRepository<Coupon, Integer> {
    //Tim coupon theo code
    Optional<Coupon> findByCode(String code);

    //Xóa coupon theo id
    void deleteById(int id);
}
