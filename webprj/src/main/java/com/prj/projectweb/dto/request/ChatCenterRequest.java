package com.prj.projectweb.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatCenterRequest {
    private Long senderId;
    private Long receiverId;
    private String messageContent;
    private Long centerId;
}
