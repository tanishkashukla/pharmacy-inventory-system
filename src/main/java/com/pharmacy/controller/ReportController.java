package com.pharmacy.controller;

import com.pharmacy.model.Batch;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.Order;
import com.pharmacy.service.InventoryService;
import com.pharmacy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private OrderService orderService;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        List<Medicine> medicines = inventoryService.getAllMedicines();
        List<Order> orders = orderService.getAllOrders();

        long totalMedicines = medicines.size();
        long lowStockCount = medicines.stream().filter(m -> m.getTotalQuantity() <= 20).count();
        
        List<Order> salesOnly = orders.stream()
                .filter(o -> "SALE".equalsIgnoreCase(o.getOrderType()))
                .toList();

        long totalOrders = salesOnly.size();
        double totalRevenue = salesOnly.stream().mapToDouble(Order::getTotalPrice).sum();

        LocalDate thirtyDaysFromNow = LocalDate.now().plusDays(30);
        long expiringSoon = 0;
        for (Medicine m : medicines) {
            for (Batch b : m.getBatches()) {
                LocalDate expiry = LocalDate.parse(b.getExpiryDate());
                if (expiry.isBefore(thirtyDaysFromNow) && expiry.isAfter(LocalDate.now())) {
                    expiringSoon++;
                    break;
                }
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMedicines", totalMedicines);
        stats.put("lowStockCount", lowStockCount);
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("expiringSoon", expiringSoon);

        return stats;
    }
}
