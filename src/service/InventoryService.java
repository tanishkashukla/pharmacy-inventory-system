package service;

import java.util.ArrayList;
import model.Medicine;

public class InventoryService {

    private ArrayList<Medicine> medicines = new ArrayList<>();

    // Add medicine
    public void addMedicine(Medicine medicine) {
        medicines.add(medicine);
        System.out.println("Medicine added successfully.");
    }

    // View medicines
    public void viewMedicines() {
        for (Medicine m : medicines) {
            System.out.println("Name: " + m.getName() +
                    ", Category: " + m.getCategory() +
                    ", Price: " + m.getPrice() +
                    ", Quantity: " + m.getQuantity());
        }
    }

    // Search medicine
    public void searchMedicine(String name) {
        boolean found = false;

        for (Medicine m : medicines) {
            if (m.getName().equalsIgnoreCase(name)) {
                System.out.println("Found: " + m.getName() +
                        ", Category: " + m.getCategory() +
                        ", Price: " + m.getPrice() +
                        ", Quantity: " + m.getQuantity());
                found = true;
            }
        }

        if (!found) {
            System.out.println("Medicine not found.");
        }
    }
}