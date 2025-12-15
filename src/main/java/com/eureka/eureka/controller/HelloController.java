package com.eureka.eureka.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HelloController {

    @GetMapping("/hello")
    public Map<String, Object> hello() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Welcome to Eureka Quiz Platform API!");
        response.put("status", "success");
        response.put("description", "Real-time quiz battle platform for university participants");
        return response;
    }
}

