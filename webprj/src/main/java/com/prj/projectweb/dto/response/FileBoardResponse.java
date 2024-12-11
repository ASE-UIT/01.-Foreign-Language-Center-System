package com.prj.projectweb.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class FileBoardResponse {
    private Long id;
    private String filename;
    private String downloadLink;
    private boolean isPublic;
    private Long courseId;
    private Long giangVienId;
    private LocalDateTime createdAt;
    private Long centerId;
}