package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.ChatMessageRequest;
import com.prj.projectweb.dto.response.ChatMessageResponse;
import com.prj.projectweb.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/chat")
@Validated
public class ChatMessageController {
    @Autowired
    private ChatMessageService chatMessageService;

    @GetMapping("/courses/{courseId}/messages")
    public ResponseEntity<List<ChatMessageResponse>> getMessagesByCourse(@PathVariable Long courseId) {
        List<ChatMessageResponse> messages = chatMessageService.getMessagesByCourseId(courseId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        try {
            ChatMessageResponse savedMessage = chatMessageService.saveMessage(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedMessage);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while sending the message");
        }
    }

}
