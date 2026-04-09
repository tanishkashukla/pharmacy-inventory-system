package com.pharmacy.repository;

import com.pharmacy.model.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, String> {
    List<Batch> findByMedicineId(String medicineId);
}
