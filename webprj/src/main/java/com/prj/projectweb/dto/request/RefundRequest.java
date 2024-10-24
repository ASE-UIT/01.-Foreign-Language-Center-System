package com.prj.projectweb.dto.request;

import com.prj.projectweb.enumType.RefundAmount;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequest {
    private String studentEmail; 
    private Long courseId; 
    private String reason;
    private RefundAmount refundAmount; 
}

