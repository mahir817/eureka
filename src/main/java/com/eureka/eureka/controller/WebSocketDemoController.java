package com.eureka.eureka.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketDemoController {

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Map<String, Object> greeting(Map<String, String> message) {
        Map<String, Object> response = new HashMap<>();
        String name = message.getOrDefault("name", "Anonymous");
        response.put("content", "Hello, " + name + "! WebSocket is working! 🎉");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("server", "Eureka Quiz Platform");
        return response;
    }

    @MessageMapping("/test")
    @SendTo("/topic/test")
    public Map<String, Object> test(Map<String, String> message) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "WebSocket connection successful!");
        response.put("message", message.getOrDefault("text", "No message"));
        response.put("timestamp", LocalDateTime.now().toString());
        return response;
    }
}

