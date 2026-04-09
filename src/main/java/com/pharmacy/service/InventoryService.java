package com.pharmacy.service;

import com.pharmacy.model.Batch;
import com.pharmacy.model.Medicine;
import com.pharmacy.repository.BatchRepository;
import com.pharmacy.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class InventoryService {

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private BatchRepository batchRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(String id) {
        return medicineRepository.findById(id);
    }

    @Transactional
    public Medicine saveMedicine(Medicine medicine, String batchNumber, int quantity, String expiryDate) {
        Optional<Medicine> existing = medicineRepository.findByNameIgnoreCase(medicine.getName());
        Medicine targetMedicine;
        
        if (existing.isPresent()) {
            targetMedicine = existing.get();
            targetMedicine.setCategory(medicine.getCategory());
            targetMedicine.setPrice(medicine.getPrice());
        } else {
            targetMedicine = medicineRepository.save(medicine);
        }

        Batch batch = new Batch(batchNumber, quantity, expiryDate, targetMedicine);
        batchRepository.save(batch);
        
        return medicineRepository.findById(targetMedicine.getId()).get();
    }

    @Transactional
    public Medicine updateMedicine(String id, Medicine updatedMedicine) {
        return medicineRepository.findById(id).map(medicine -> {
            medicine.setName(updatedMedicine.getName());
            medicine.setCategory(updatedMedicine.getCategory());
            medicine.setPrice(updatedMedicine.getPrice());
            return medicineRepository.save(medicine);
        }).orElseThrow(() -> new RuntimeException("Medicine not found"));
    }

    @Transactional
    public void deleteMedicine(String id) {
        medicineRepository.deleteById(id);
    }

    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(query, query);
    }
}
