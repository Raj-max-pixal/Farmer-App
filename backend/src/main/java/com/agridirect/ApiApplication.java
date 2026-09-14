package com.agridirect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
public class ApiApplication {
  public static void main(String[] args) { SpringApplication.run(ApiApplication.class, args); }

  @PostMapping("/auth/login")
  Map<String, Object> login(@RequestBody Map<String, String> request) {
    return Map.of("token", "demo-jwt-agridirect", "role", request.getOrDefault("role", "FARMER"), "expiresIn", 86400);
  }

  @GetMapping("/products/{id}/recommendation")
  Map<String, Object> recommendation(@PathVariable long id) {
    double mandiAverage = 28.67;
    int matchedDemandKg = 200;
    double demandSignal = 32.0;
    double recommended = mandiAverage * 0.60 + demandSignal * 0.40;
    return Map.of("productId", id, "mandiAverage", mandiAverage, "demandSignal", demandSignal, "recommendedRange", List.of(Math.round(recommended - 2), Math.round(recommended + 2)), "formula", "(nearbyMandiAverage * 0.60) + (demandSignal * 0.40)", "matchedDemandKg", matchedDemandKg);
  }

  @GetMapping("/products/{id}/matches")
  List<Map<String, Object>> matches(@PathVariable long id) {
    return List.of(Map.of("buyer", "FreshCart Retail", "offerPrice", 31, "distanceKm", 6, "rankScore", 96), Map.of("buyer", "The Green Plate", "offerPrice", 30, "distanceKm", 11, "rankScore", 89), Map.of("buyer", "Daily Basket", "offerPrice", 29, "distanceKm", 4, "rankScore", 84));
  }

  @PostMapping("/orders/{id}/payment")
  Map<String, String> holdPayment(@PathVariable long id) { return Map.of("orderId", String.valueOf(id), "escrowStatus", "HELD", "message", "Funds held until delivery confirmation"); }

  @PostMapping("/orders/{id}/delivery-confirmation")
  Map<String, String> confirmDelivery(@PathVariable long id) { return Map.of("orderId", String.valueOf(id), "escrowStatus", "RELEASED", "message", "Funds released to farmer"); }
}
