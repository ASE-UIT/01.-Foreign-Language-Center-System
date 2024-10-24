package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.RefundRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/refund")
public class RefundController {

    @Autowired
    private RefundService refundService;

    @PostMapping("/process")
    public ResponseEntity<ApiResponse<String>> processRefund(@RequestBody RefundRequest refundRequest) {
        try {
            String result = refundService.processRefund(refundRequest);
            return ResponseEntity.ok(
                    ApiResponse.<String>builder()
                            .code(HttpStatus.OK.value())
                            .message(result)
                            .result("SUCCESS")
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.<String>builder()
                            .code(HttpStatus.BAD_REQUEST.value())
                            .message(e.getMessage())
                            .result("FAILED")
                            .build()
            );
        }
    }
}
