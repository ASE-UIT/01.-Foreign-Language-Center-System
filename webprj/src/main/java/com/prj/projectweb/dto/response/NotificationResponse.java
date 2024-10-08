package com.prj.projectweb.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private LocalDateTime notificationTime; // Thời gian thông báo
    private LocalDateTime classTime; // Thời gian lớp học
}
