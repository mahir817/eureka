package com.eureka.controller;

import com.eureka.model.Friendship;
import com.eureka.model.User;
import com.eureka.repository.FriendshipRepository;
import com.eureka.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:8080", "http://localhost:8081" })
@RestController
@RequestMapping("/friends")
public class FriendController {

    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BuzzerController buzzerController;

    @PostMapping("/add/{username}/{friendUsername}")
    public ResponseEntity<String> addFriend(@PathVariable String username, @PathVariable String friendUsername) {
        if (username.equals(friendUsername)) {
            return ResponseEntity.badRequest().body("Cannot add yourself as friend");
        }

        User user1 = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        User user2 = userRepository.findByUsername(friendUsername)
                .orElseThrow(() -> new IllegalArgumentException("Friend not found"));

        // Check if already friends
        List<Friendship> existing = friendshipRepository.findByUser1OrUser2(user1, user1);
        for (Friendship f : existing) {
            if ((f.getUser1().equals(user1) && f.getUser2().equals(user2)) ||
                    (f.getUser1().equals(user2) && f.getUser2().equals(user1))) {
                return ResponseEntity.badRequest().body("Already friends");
            }
        }

        Friendship friendship = new Friendship();
        friendship.setUser1(user1);
        friendship.setUser2(user2);
        friendship.setStatus("ACCEPTED"); // Auto-accept for now as per requirements
        friendshipRepository.save(friendship);

        return ResponseEntity.ok("Friend added successfully");
    }

    @GetMapping("/{username}")
    public List<User> getFriends(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Friendship> friendships = friendshipRepository.findByUser1OrUser2(user, user);
        List<User> friends = new ArrayList<>();

        for (Friendship f : friendships) {
            if (f.getUser1().equals(user))
                friends.add(f.getUser2());
            else
                friends.add(f.getUser1());
        }

        return friends;
    }

    @PostMapping("/invite/{username}/{friendUsername}/{buzzerId}")
    public ResponseEntity<String> inviteFriend(@PathVariable String username, @PathVariable String friendUsername,
            @PathVariable Long buzzerId) {
        User friend = userRepository.findByUsername(friendUsername)
                .orElseThrow(() -> new IllegalArgumentException("Friend not found"));

        // In a real app, we should look up the buzzer details.
        // For now, we reuse the buzzer sharing logic but target a specific user.

        // Generate the message same as shareOnline
        try {
            buzzerController.shareOnline(buzzerId);
            // Ideally we should send a private message, but shareOnline broadcasts to
            // /topic/all/messages
            // which the Header listens to.
            // But wait, Header listens to WebSocketComponent logic.
            // WebSocketComponent listens to /topic/specific/{username}.

            // We should send a specific invitation.
            com.eureka.model.Buzzer buzzer = buzzerController.getBuzzerById(buzzerId);

            java.util.Map<String, String> map = new java.util.HashMap<>();
            map.put("category", buzzer.getCategory());
            map.put("stream", buzzer.getStream());
            map.put("difficulty", buzzer.getDifficulty());
            map.put("buzzer_id", buzzer.getId() + "");
            map.put("dateTime", buzzer.getDateTime());
            map.put("gameState", buzzer.getGameState());
            map.put("secretCode", buzzer.getSecretCode());
            map.put("count", buzzer.getQuestionCount() + "");
            map.put("player1", buzzer.getPlayer1().getUsername());
            map.put("player1Ratings", buzzer.getPlayer1().getRatings() + "");
            map.put("player1Profession", buzzer.getPlayer1().getProfession());
            map.put("player1Institute", buzzer.getPlayer1().getInstitute());

            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String json = mapper.writeValueAsString(map);

            buzzerController.sendMessageToUser(json, friendUsername);

            return ResponseEntity.ok("Invited");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error");
        }
    }
}
