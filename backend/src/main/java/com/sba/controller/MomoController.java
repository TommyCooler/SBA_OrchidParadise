package com.sba.controller;

import com.sba.service.IMomoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class MomoController {

    @Autowired
    private IMomoService iMomoService;

    @PostMapping("/create-payment-url")
    public ResponseEntity<?> createPaymentUrl(@RequestBody Long orderId) {
        String url = iMomoService.createPaymentUrl(orderId);
        // System.out.println("Payment URL created: " + url);
        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/handle-payment")
    public ResponseEntity<?> handlePayment(@RequestBody Map<String, String> payload) {

        if (payload == null || payload.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid payload");
        }

        if (!payload.containsKey("orderId") || !payload.containsKey("status")) {
            return ResponseEntity.badRequest().body("Missing required fields in payload");
        }
        String message = iMomoService.handlePayment(payload);
//        System.out.println("Received payload:\n" + payload);
        return ResponseEntity.ok(message);
    }
}
