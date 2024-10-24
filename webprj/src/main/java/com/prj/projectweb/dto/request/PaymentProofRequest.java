package com.prj.projectweb.dto.request;

import org.springframework.web.multipart.MultipartFile;

public class PaymentProofRequest {

    private MultipartFile file;
    private String uploadedBy; // Tên nhân viên chăm sóc khách hàng

    // Getters and Setters
    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }

    // Getter và Setter cho 'uploadedBy'
    public String getUploadedBy() {
        return uploadedBy;
    }

    public void setUploadedBy(String uploadedBy) {
        this.uploadedBy = uploadedBy;
    }
}

