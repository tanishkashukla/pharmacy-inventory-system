package model;

public class Medicine {
    private String name;
    private String category;
    private double price;
    private int quantity;

    public Medicine(String name, String category, double price, int quantity) {
        this.name = name;
        this.category = category;
        this.price = price;
        this.quantity = quantity;
    }
}