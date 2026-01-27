package com.eureka.controller;

import org.springframework.beans.factory.annotation.Autowired;

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

    @Autowired
    private org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat/{buzzerId}")
    @SendTo("/all/chat/{buzzerId}")
    public Map<String, String> processMessage(@DestinationVariable String buzzerId,
            @Payload Map<String, String> message) {
        return message;
    }

    @MessageMapping("/chat.private")
    public void sendPrivateMessage(@Payload Map<String, String> message) {
        String toUser = message.get("to");
        if (toUser != null && !toUser.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/private/" + toUser, message);
        }
    }
}
