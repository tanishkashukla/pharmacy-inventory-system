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

    // View all medicines
    public void viewMedicines() {
        for (Medicine m : medicines) {
            System.out.println("Name: " + m.getName() +
                    ", Category: " + m.getCategory() +
                    ", Price: " + m.getPrice() +
                    ", Quantity: " + m.getQuantity());
        }
    }
}