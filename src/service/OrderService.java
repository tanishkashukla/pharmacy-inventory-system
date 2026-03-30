package service;

import java.util.ArrayList;
import model.Order;

public class OrderService {

    private ArrayList<Order> orders = new ArrayList<>();

    public void placeOrder(Order order) {
        orders.add(order);
        System.out.println("Order placed successfully.");
    }

    public void viewOrders() {
        for (Order o : orders) {
            System.out.println("Order ID: " + o.getOrderId() +
                    ", Medicine: " + o.getMedicineName() +
                    ", Quantity: " + o.getQuantity());
        }
    }
}