package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.RefundRequest;
import com.prj.projectweb.service.RefundService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {

    @Autowired
    private RefundService refundService;

    @PostMapping("/process")
    public ResponseEntity<String> processRefund(@RequestBody RefundRequest request) {
        String result = String.valueOf(refundService.processRefund(request));
        return ResponseEntity.ok(result);
    }
}

