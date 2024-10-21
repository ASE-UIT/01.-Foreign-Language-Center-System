package com.prj.projectweb.controller;

import com.prj.projectweb.dto.response.PaymentProofResponse;
import com.prj.projectweb.service.PaymentProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment-proof")
public class PaymentProofController {

    @Autowired
    private PaymentProofService paymentProofService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPaymentProof(@RequestParam Long userId,
                                                     @RequestParam Long courseRegistrationId,
                                                     @RequestParam MultipartFile file) throws IOException {
        paymentProofService.uploadPaymentProof(userId, courseRegistrationId, file);
        return ResponseEntity.ok("Upload thành công và học viên đã được xác nhận thanh toán.");
    }
}
