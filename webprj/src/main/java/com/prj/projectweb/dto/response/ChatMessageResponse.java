package com.prj.projectweb.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessageResponse {
    private String message;
    private Long userId;
    private String username; 
    private LocalDateTime createdAt;
}
