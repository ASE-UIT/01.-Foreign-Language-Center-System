package com.prj.projectweb.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RefundResponse {
    // Getter và Setter
    private String message;
    private String studentEmail;
    private String courseName;
    private double refundAmount; // Số tiền hoàn lại
    private String reason;

    public RefundResponse(String message, String studentEmail, String courseName, double refundAmount, String reason) {
        this.message = message;
        this.studentEmail = studentEmail;
        this.courseName = courseName;
        this.refundAmount = refundAmount;
        this.reason = reason;
    }
}

