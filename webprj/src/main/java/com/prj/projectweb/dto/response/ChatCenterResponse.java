package com.prj.projectweb.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ChatCenterResponse {
    private Long id;
    private Long senderId;
    private Long receiverId;
    private String messageContent;
    private LocalDateTime createdAt;
}
