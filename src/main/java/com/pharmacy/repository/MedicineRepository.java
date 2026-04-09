package com.pharmacy.repository;

import com.pharmacy.model.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MedicineRepository extends JpaRepository<Medicine, String> {
    Optional<Medicine> findByNameIgnoreCase(String name);
    List<Medicine> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(String name, String category);
}
