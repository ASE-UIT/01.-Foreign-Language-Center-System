package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.NotificationRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.ChatMessageResponse;
import com.prj.projectweb.dto.response.NotificationResponse;
import com.prj.projectweb.service.UserService;

import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
@Slf4j
public class NotificationController {

    private final UserService userService;

    public NotificationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> getUpcomingClassNotification(@RequestBody NotificationRequest request) {
        NotificationResponse response = userService.checkUpcomingClass(request);
        if (response != null) {
            return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<NotificationResponse>builder()
                    .code(HttpStatus.OK.value())
                    .result(response)
                    .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(
                ApiResponse.<String>builder()
                    .code(HttpStatus.NO_CONTENT.value())
                    .result("No courses tomorrow ")
                    .build()
            );
        }
    }
}
