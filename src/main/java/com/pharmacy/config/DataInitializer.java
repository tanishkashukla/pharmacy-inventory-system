package com.pharmacy.config;

import com.pharmacy.model.User;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.Order;
import com.pharmacy.repository.OrderRepository;
import com.pharmacy.service.InventoryService;
import com.pharmacy.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(InventoryService inventoryService, UserService userService,
            OrderRepository orderRepository) {
        return args -> {
            // -- Seed Users --
            if (userService.getAllUsers().isEmpty()) {
                userService.saveUser(new User("Admin User", "admin@pharma.com", "9876543210", "Admin", "admin123"));
                userService.saveUser(
                        new User("Pharmacist One", "pharmacist@pharma.com", "9876543211", "Pharmacist", "pass123"));
                userService.saveUser(
                        new User("Inv Manager", "manager@pharma.com", "9876543212", "Inventory Manager", "pass123"));
                userService.saveUser(
                        new User("Buyer User", "buyer@pharma.com", "9876543213", "Buyer", "pass123"));
            }

            // -- Seed Medicines --
            if (inventoryService.getAllMedicines().isEmpty()) {
                // 1. Critical Low Stock
                inventoryService.saveMedicine(
                        new Medicine("Paracetamol 500mg", "Analgesic", 45.0),
                        "B-1001", 12, LocalDate.now().plusMonths(8).toString());

                // 2. Expiring Soon (Next 15 days)
                inventoryService.saveMedicine(
                        new Medicine("Amoxicillin 250mg", "Antibiotic", 120.0),
                        "B-1002", 75, LocalDate.now().plusDays(15).toString());

                // 3. Healthy Stock
                inventoryService.saveMedicine(
                        new Medicine("Cetirizine 10mg", "Antihistamine", 85.0),
                        "B-1003", 150, LocalDate.now().plusYears(1).toString());

                // 4. Low Stock + Expiring Soon
                inventoryService.saveMedicine(
                        new Medicine("Insulin Glargine", "Hormone", 1450.0),
                        "B-1004", 5, LocalDate.now().plusDays(10).toString());

                // 5. General Item
                inventoryService.saveMedicine(
                        new Medicine("Aspirin 75mg", "Analgesic", 32.50),
                        "B-1005", 200, LocalDate.now().plusMonths(6).toString());

                // 6. More Meds
                inventoryService.saveMedicine(new Medicine("Metformin 500mg", "Antidiabetic", 110.0), "B-2001", 80,
                        "2026-10-15");
                inventoryService.saveMedicine(new Medicine("Lisinopril 10mg", "Cardiovascular", 240.0), "B-2002", 15,
                        "2026-05-20");
                inventoryService.saveMedicine(new Medicine("Atorvastatin 20mg", "Cholesterol", 320.0), "B-2003", 45,
                        "2027-01-10");
                inventoryService.saveMedicine(new Medicine("Omeprazole 20mg", "Gastrointestinal", 185.0), "B-2004", 100,
                        "2026-12-05");
                inventoryService.saveMedicine(new Medicine("Azithromycin 500mg", "Antibiotic", 450.0), "B-2005", 30,
                        "2026-04-25");
            }

            // -- Recent Transactions: Starts empty per user request --
            if (orderRepository.count() == 0) {
                // No pre-seeded orders to ensure history is clean at start
            }
        };
    }
}
