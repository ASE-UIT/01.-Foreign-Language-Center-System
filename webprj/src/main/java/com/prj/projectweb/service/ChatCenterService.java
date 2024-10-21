package com.prj.projectweb.service;

import com.prj.projectweb.entities.ChatCenter;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.repositories.ChatCenterRepository;
import com.prj.projectweb.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class ChatCenterService {

    @Autowired
    private ChatCenterRepository chatCenterRepository;

    @Autowired
    private UserRepository userRepository;

    // Send message from one user to another
    public ChatCenter sendMessage(Long senderId, Long receiverId, String messageContent) {
        User sender = userRepository.findById(senderId).orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new RuntimeException("Receiver not found"));

        // Ensure the message is allowed based on roles
        if (!isMessageAllowed(sender, receiver)) {
            throw new RuntimeException("Message not allowed between these users");
        }

        ChatCenter chatCenter = ChatCenter.builder()
                .sender(sender)
                .receiver(receiver)
                .messageContent(messageContent)
                .createdAt(LocalDateTime.now())
                .build();

        return chatCenterRepository.save(chatCenter);
    }

    // Get messages for a specific user
    public List<ChatCenter> getMessagesForUser(Long userId) {
        return chatCenterRepository.findByReceiver_UserId(userId);
    }

    // Logic to determine if a message can be sent between the users based on their roles
    private boolean isMessageAllowed(User sender, User receiver) {
        String senderRole = sender.getRole().getRoleName();
        String receiverRole = receiver.getRole().getRoleName();
        log.info("ROLE: " + senderRole + " ---- " +  receiverRole);

        // Students and Parents can only message center staff (but not each other)
        if (("HocVien".equals(senderRole) || "PhuHuynh".equals(senderRole)) && isCenterRole(receiverRole)) {
            return true;
        }

        // Center staff can message students and parents
        if (isCenterRole(senderRole) && ("HocVien".equals(receiverRole) || "PhuHuynh".equals(receiverRole))) {
            return true;
        }

        // If both are center staff, restrict messaging
        return false;
    }

    // Check if the user role is a center staff role
    private boolean isCenterRole(String role) {
        return List.of("GiaoVien", "NhanVienHoTroHocVu", "BanDieuHanh").contains(role);
    }
}
