package service;

import model.Order;
import java.util.ArrayList;

public class OrderService {

    private ArrayList<Order> orders = new ArrayList<>();

    // Place order
    public void placeOrder(Order order) {
        orders.add(order);
        System.out.println("Order placed successfully.");
    }

    // View orders
    public void viewOrders() {
        for (Order o : orders) {
            System.out.println("Order ID: " + o.getOrderId() +
                    ", Medicine: " + o.getMedicineName() +
                    ", Quantity: " + o.getQuantity());
        }
    }
}