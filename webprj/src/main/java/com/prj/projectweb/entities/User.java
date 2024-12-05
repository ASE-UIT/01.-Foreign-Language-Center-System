package com.prj.projectweb.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long userId;

    @Column(name = "email", unique = true, columnDefinition = "VARCHAR(255)")
    String email;
    String username;
    String password;
    String fullName;
    String phone;
    String address;
    LocalDate dob;
    
    @Lob
    String image;

    @ManyToOne
    Role role;

    // Nếu user là học sinh, trường này chứa id của phụ huynh.
    Long parentId;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<ChatMessage> chatMessages = new ArrayList<>();

     // Messages sent by the user
    @OneToMany(mappedBy = "sender", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<ChatCenter> sentMessages = new ArrayList<>();

     // Messages received by the user
    @OneToMany(mappedBy = "receiver", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<ChatCenter> receivedMessages = new ArrayList<>();

    // Thêm center_id để biết user thuộc trung tâm nào
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    @JsonBackReference
    Center center;

     // Phương thức tiện ích cho ChatMessage
    public void addChatMessage(ChatMessage message) {
        chatMessages.add(message);
        message.setUser(this);
    }
    public void removeChatMessage(ChatMessage message) {
        chatMessages.remove(message);
        message.setUser(null);
    }

    // Phương thức tiện ích cho ChatCenter
    public void addSentMessage(ChatCenter message) {
        sentMessages.add(message);
        message.setSender(this);
    }

    public void addReceivedMessage(ChatCenter message) {
        receivedMessages.add(message);
        message.setReceiver(this);
    }
}


