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
    public Order placeOrder(String medicineId, int quantity, String batchId, String customerId, String orderType) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        boolean isRestock = "RESTOCK".equalsIgnoreCase(orderType);

        if (!isRestock && medicine.getTotalQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        double totalPrice = medicine.getPrice() * quantity;
        
        // Stock Update Logic
        if (batchId != null && !batchId.isEmpty()) {
            // Update a specific batch
            Batch batch = batchRepository.findById(batchId)
                    .orElseThrow(() -> new RuntimeException("Batch not found"));
            
            if (isRestock) {
                batch.setQuantity(batch.getQuantity() + quantity);
            } else {
                if (batch.getQuantity() < quantity) {
                    throw new RuntimeException("Insufficient stock in selected batch");
                }
                batch.setQuantity(batch.getQuantity() - quantity);
            }
            batchRepository.save(batch);
        } else if (!isRestock) {
            // Reduce stock from batches (FIFO approach) - only for SALE
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
        } else {
            // For general RESTOCK without explicit batchId (though frontend should provide one)
            // Default to updating the most recent batch or first batch
            if (!medicine.getBatches().isEmpty()) {
                Batch firstBatch = medicine.getBatches().get(0);
                firstBatch.setQuantity(firstBatch.getQuantity() + quantity);
                batchRepository.save(firstBatch);
            }
        }

        Order order = new Order(medicine.getName(), quantity, totalPrice, batchId, customerId, orderType);
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
