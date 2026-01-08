package com.eureka.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.Map;

@CrossOrigin(origins = "*")
@Controller
public class ChatController {

    @MessageMapping("/chat/{buzzerId}")
    @SendTo("/all/chat/{buzzerId}")
    public Map<String, String> processMessage(@DestinationVariable String buzzerId,
            @Payload Map<String, String> message) {
        // Here we could simulate some 'threading' logic if strictly needed,
        // e.g., logging thread name:
        // System.out.println(Thread.currentThread().getName());
        // For now, simple broadcast
        return message;
    }
}
