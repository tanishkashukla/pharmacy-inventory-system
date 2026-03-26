package model;

public class Order {
    private String orderId;
    private String medicineName;
    private int quantity;

    public Order(String orderId, String medicineName, int quantity) {
        this.orderId = orderId;
        this.medicineName = medicineName;
        this.quantity = quantity;
    }
    public String getOrderId() {
        return orderId;
    }

    public String getMedicineName() {
        return medicineName;
    }

    public int getQuantity() {
        return quantity;
    }
}