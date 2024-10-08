package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.NotificationRequest;
import com.prj.projectweb.dto.response.NotificationResponse;
import com.prj.projectweb.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final UserService userService;

    public NotificationController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<NotificationResponse> getUpcomingClassNotification(@RequestBody NotificationRequest request) {
        NotificationResponse response = userService.checkUpcomingClass(request);
        if (response != null) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.noContent().build(); // Không có lớp học nào
        }
    }
}
