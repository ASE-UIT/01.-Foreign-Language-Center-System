package com.prj.projectweb.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private String notificationTime; // Thời gian thông báo
    private String classTime; // Thời gian lớp học
}
