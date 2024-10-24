package com.prj.projectweb.dto.request;

import com.prj.projectweb.exception.RefundAmount;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RefundRequest {
    // Getter và Setter
    private String studentEmail;
    private String courseName;
    private String reason;
    private RefundAmount refundAmount; // Enum chỉ định loại hoàn tiền
    private Long courseId;
    private String email; 

    // Constructor
    public RefundRequest(String studentEmail, String courseName, String reason, RefundAmount refundAmount) {
        this.studentEmail = studentEmail;
        this.courseName = courseName;
        this.reason = reason;
        this.refundAmount = refundAmount;
    }
}
