package model;

import java.time.LocalDate;

public class Batch {
    private String batchId;
    private LocalDate expiryDate;
    private int quantity;

    public Batch(String batchId, LocalDate expiryDate, int quantity) {
        this.batchId = batchId;
        this.expiryDate = expiryDate;
        this.quantity = quantity;
    }

    // Getters
    public String getBatchId() {
        return batchId;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public int getQuantity() {
        return quantity;
    }

    // Setters
    public void setBatchId(String batchId) {
        this.batchId = batchId;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}