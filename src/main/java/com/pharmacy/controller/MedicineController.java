package com.pharmacy.controller;

import com.pharmacy.model.Medicine;
import com.pharmacy.service.InventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private InventoryService inventoryService;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return inventoryService.getAllMedicines();
    }

    @PostMapping
    public Medicine addMedicine(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        String category = (String) payload.get("category");
        double price = Double.parseDouble(payload.get("price").toString());
        String batchNumber = (String) payload.get("batchNumber");
        int quantity = Integer.parseInt(payload.get("quantity").toString());
        String expiryDate = (String) payload.get("expiryDate");

        Medicine medicine = new Medicine(name, category, price);
        return inventoryService.saveMedicine(medicine, batchNumber, quantity, expiryDate);
    }

    @PutMapping("/{id}")
    public Medicine updateMedicine(@PathVariable("id") String id, @RequestBody Medicine medicine) {
        return inventoryService.updateMedicine(id, medicine);
    }

    @DeleteMapping("/{id}")
    public void deleteMedicine(@PathVariable("id") String id) {
        inventoryService.deleteMedicine(id);
    }

    @GetMapping("/search")
    public List<Medicine> searchMedicines(@RequestParam("query") String query) {
        return inventoryService.searchMedicines(query);
    }
}
