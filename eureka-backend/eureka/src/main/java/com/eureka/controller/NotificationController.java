package com.eureka.controller;

import com.eureka.model.Notification;
import com.eureka.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/notifications/{username}")
    public List<Notification> getUserNotifications(@PathVariable String username) {
        return notificationRepository.findByRecipientOrderByTimestampDesc(username);
    }

    @PostMapping("/notifications/poke")
    public Notification sendPoke(@RequestBody Map<String, String> payload) {
        String sender = payload.get("sender");
        String recipient = payload.get("recipient");

        Notification notif = new Notification(
                recipient,
                "POKE",
                "Your friend " + sender + " poked you to battle!",
                sender,
                null);

        Notification saved = notificationRepository.save(notif);

        // Real-time
        messagingTemplate.convertAndSend("/topic/private/" + recipient, saved);

        return saved;
    }
}
