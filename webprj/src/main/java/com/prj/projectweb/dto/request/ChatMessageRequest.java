package com.prj.projectweb.dto.request;

import lombok.Data;

@Data
public class ChatMessageRequest {
    private Long courseId;
    private Long userId;
    private String message;
}
