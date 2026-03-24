package com.example.backend.dao.user;

import com.example.backend.dao.user.RoleRepository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import com.example.backend.entity.user.Role;

@RepositoryRestResource(path = "roles")
public interface RoleRepository extends JpaRepository<Role, Integer> {
    //Tìm kiếm role theo tên role
    public Role findByNameRole(String nameRole);
}
