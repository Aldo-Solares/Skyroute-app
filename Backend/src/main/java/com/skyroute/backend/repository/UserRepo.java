package com.skyroute.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skyroute.backend.model.Users;

public interface UserRepo extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
}
