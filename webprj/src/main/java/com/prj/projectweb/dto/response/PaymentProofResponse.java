package com.prj.projectweb.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class PaymentProofResponse {

    // Getter và Setter cho 'id'
    private Long id;
    // Getter và Setter cho 'fileName'
    private String fileName;
    // Getter và Setter cho 'fileType'
    private String fileType;
    // Getter và Setter cho 'uploadTime'
    private LocalDateTime uploadTime;
    // Getter và Setter cho 'uploadedBy'
    private String uploadedBy;
}

