package com.pharmacy.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "medicines")
public class Medicine {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private double price;

    @OneToMany(mappedBy = "medicine", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Batch> batches;

    public Medicine() {}

    public Medicine(String name, String category, double price) {
        this.name = name;
        this.category = category;
        this.price = price;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public List<Batch> getBatches() { return batches; }
    public void setBatches(List<Batch> batches) { this.batches = batches; }

    // Helper for total quantity
    public int getTotalQuantity() {
        if (batches == null) return 0;
        return batches.stream().mapToInt(Batch::getQuantity).sum();
    }
}
