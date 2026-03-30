package ui;

import service.InventoryService;
import service.OrderService;
import model.Medicine;
import model.Order;

import java.util.Scanner;

public class Menu {

    private InventoryService inventoryService = new InventoryService();
    private OrderService orderService = new OrderService();
    private Scanner scanner = new Scanner(System.in);

    public void start() {
        while (true) {
            System.out.println("\n--- Pharmacy System Menu ---");
            System.out.println("1. Add Medicine");
            System.out.println("2. View Medicines");
            System.out.println("3. Place Order");
            System.out.println("4. View Orders");
            System.out.println("5. Exit");
            System.out.println("6. Search Medicine");
            System.out.println("7. Delete Medicine");

            int choice = scanner.nextInt();
            scanner.nextLine();

            switch (choice) {
                case 1:
                    addMedicine();
                    break;
                case 2:
                    inventoryService.viewMedicines();
                    break;
                case 3:
                    placeOrder();
                    break;
                case 4:
                    orderService.viewOrders();
                    break;
                case 5:
                    System.out.println("Exiting...");
                    return;
                case 6:
                    searchMedicine();
                    break;
                case 7:
                    deleteMedicine();
                    break;
                default:
                    System.out.println("Invalid choice");
            }
        }
    }

    private void addMedicine() {
        System.out.print("Enter name: ");
        String name = scanner.nextLine();

        System.out.print("Enter category: ");
        String category = scanner.nextLine();

        System.out.print("Enter price: ");
        double price = scanner.nextDouble();

        System.out.print("Enter quantity: ");
        int quantity = scanner.nextInt();
        scanner.nextLine();

        Medicine medicine = new Medicine(name, category, price, quantity);
        inventoryService.addMedicine(medicine);
    }

    private void placeOrder() {
        System.out.print("Enter order ID: ");
        String orderId = scanner.nextLine();

        System.out.print("Enter medicine name: ");
        String medicineName = scanner.nextLine();

        System.out.print("Enter quantity: ");
        int quantity = scanner.nextInt();
        scanner.nextLine();

        Order order = new Order(orderId, medicineName, quantity);
        orderService.placeOrder(order);
    }

    private void searchMedicine() {
        System.out.print("Enter medicine name to search: ");
        String name = scanner.nextLine();

        inventoryService.searchMedicine(name);
    }

    private void deleteMedicine() {
        System.out.print("Enter medicine name to delete: ");
        String name = scanner.nextLine();

        inventoryService.deleteMedicine(name);
    }
}