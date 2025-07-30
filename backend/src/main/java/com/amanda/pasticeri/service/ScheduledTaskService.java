package com.amanda.pasticeri.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class ScheduledTaskService {

    @Autowired
    private OrderService orderService;

    // ✅ Run every 5 minutes to check for menu orders that need to be auto-completed
    @Scheduled(fixedRate = 300000) // 5 minutes = 300,000 milliseconds
    public void autoCompleteMenuOrders() {
        System.out.println("🕐 Running scheduled task: autoCompleteMenuOrders");
        try {
            orderService.autoCompleteMenuOrders();
        } catch (Exception e) {
            System.err.println("❌ Error in autoCompleteMenuOrders scheduled task: " + e.getMessage());
            e.printStackTrace();
        }
    }
} 