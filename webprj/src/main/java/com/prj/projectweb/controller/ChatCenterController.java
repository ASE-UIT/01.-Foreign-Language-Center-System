package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.ChatCenterRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.entities.ChatCenter;
import com.prj.projectweb.service.ChatCenterService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatcenter")
@Slf4j
public class ChatCenterController {

    @Autowired
    private ChatCenterService chatCenterService;

    @PostMapping("/send")
    public ResponseEntity<ApiResponse<?>> sendMessage(
            @RequestBody ChatCenterRequest request) {
        try {
            ChatCenter chatCenter = chatCenterService.sendMessage(request.getSenderId(), request.getReceiverId(), request.getMessageContent());
            ApiResponse<ChatCenter> response = ApiResponse.<ChatCenter>builder()
                    .message("Message sent successfully")
                    .code(HttpStatus.CREATED.value())
                    .result(chatCenter)
                    .build();
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                ApiResponse.<String>builder()
                    .message(e.getMessage())
                    .code(HttpStatus.BAD_REQUEST.value())
                    .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<String>builder()
                            .message("An error occurred while sending the message")
                            .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                            .build()
            );
        }
    }

    @GetMapping("/messages")
    public ResponseEntity<List<ChatCenter>> getMessagesForUser(@RequestParam(name="userId") Long userId) {
        log.info("id = " + userId);
        List<ChatCenter> messages = chatCenterService.getMessagesForUser(userId);
        return ResponseEntity.ok(messages);
    }
}
