package com.pharmacy.repository;

import com.pharmacy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCaseOrRoleContainingIgnoreCase(String name, String role);
}
