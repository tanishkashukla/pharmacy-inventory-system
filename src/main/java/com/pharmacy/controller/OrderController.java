package com.pharmacy.controller;

import com.pharmacy.model.Order;
import com.pharmacy.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping
    public Order placeOrder(@RequestBody Map<String, Object> payload) {
        String medicineId = (String) payload.get("id");
        int quantity = Integer.parseInt(payload.get("orderQuantity").toString());
        return orderService.placeOrder(medicineId, quantity);
    }
}
