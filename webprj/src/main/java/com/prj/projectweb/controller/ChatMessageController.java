package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.ChatMessageRequest;
import com.prj.projectweb.dto.response.ApiResponse;
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
    public ApiResponse<List<ChatMessageResponse>> getMessagesByCourse(@PathVariable Long courseId) {
        List<ChatMessageResponse> messages = chatMessageService.getMessagesByCourseId(courseId);
        return ApiResponse.<List<ChatMessageResponse>>builder()
        .message("get all message in course with id = " + courseId)
        .result(messages)
        .build();
    }

    @PostMapping("/messages")
    public ResponseEntity<ApiResponse<?>> sendMessage(@Valid @RequestBody ChatMessageRequest request) {
        try {
            ChatMessageResponse savedMessage = chatMessageService.saveMessage(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<ChatMessageResponse>builder()
                    .message("Message sent successfully")
                    .code(HttpStatus.CREATED.value())
                    .result(savedMessage)
                    .build()
            );
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
    

}
