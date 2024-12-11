package com.prj.projectweb.dto.request;

import lombok.Data;

@Data
public class FileBoardUploadRequest {
    private Long giangVienId;
    private Long courseId;
    private boolean isPublic;
    private Long centerId;
}
