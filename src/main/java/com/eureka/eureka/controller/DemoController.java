package com.eureka.eureka.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/demo")
@CrossOrigin(origins = "*") // Allow all origins for demo
public class DemoController {

    @GetMapping("/hello")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Hello from Eureka Quiz Platform!");
        response.put("status", "success");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("serverPort", "8081");
        return response;
    }

    @GetMapping("/check")
    public Map<String, Object> check() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "API is working");
        response.put("services", new String[]{
            "REST API: ✅",
            "WebSocket: ✅",
            "Spring Boot: ✅",
            "Port: 8081"
        });
        return response;
    }
}

