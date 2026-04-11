package com.pharmacy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String medicineName;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private double totalPrice;

    @Column(nullable = false)
    private LocalDateTime orderDate;

    @Column
    private String batchId;

    @Column
    private String customerId;

    @Column(nullable = false)
    private String orderType = "SALE"; // Default to SALE for backward compatibility

    public Order() {
        this.orderDate = LocalDateTime.now();
    }

    public Order(String medicineName, int quantity, double totalPrice, String batchId, String customerId) {
        this(medicineName, quantity, totalPrice, batchId, customerId, "SALE");
    }

    public Order(String medicineName, int quantity, double totalPrice, String batchId, String customerId, String orderType) {
        this.medicineName = medicineName;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.batchId = batchId;
        this.customerId = customerId;
        this.orderType = orderType;
        this.orderDate = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMedicineName() { return medicineName; }
    public void setMedicineName(String medicineName) { this.medicineName = medicineName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public String getBatchId() { return batchId; }
    public void setBatchId(String batchId) { this.batchId = batchId; }

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public String getOrderType() { return orderType; }
    public void setOrderType(String orderType) { this.orderType = orderType; }
}
