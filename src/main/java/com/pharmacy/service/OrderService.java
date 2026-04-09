package com.pharmacy.service;

import com.pharmacy.model.Batch;
import com.pharmacy.model.Medicine;
import com.pharmacy.model.Order;
import com.pharmacy.repository.BatchRepository;
import com.pharmacy.repository.MedicineRepository;
import com.pharmacy.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private BatchRepository batchRepository;

    @Transactional
    public Order placeOrder(String medicineId, int quantity) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        if (medicine.getTotalQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        double totalPrice = medicine.getPrice() * quantity;
        
        // Reduce stock from batches (FIFO approach)
        int remainingToReduce = quantity;
        List<Batch> batches = medicine.getBatches();
        for (Batch batch : batches) {
            if (remainingToReduce <= 0) break;
            
            int batchQty = batch.getQuantity();
            if (batchQty <= remainingToReduce) {
                remainingToReduce -= batchQty;
                batch.setQuantity(0);
            } else {
                batch.setQuantity(batchQty - remainingToReduce);
                remainingToReduce = 0;
            }
            batchRepository.save(batch);
        }

        Order order = new Order(medicine.getName(), quantity, totalPrice);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
