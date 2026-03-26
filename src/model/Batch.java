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
}