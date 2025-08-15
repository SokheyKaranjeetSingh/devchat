package com.devchat.backend.repository;

import com.devchat.backend.entity.User;
import com.devchat.backend.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    List<User> findByVerifiedFalse();
    List<User> findByRoleAndVerifiedFalse(Role role);
}