package com.prj.projectweb.controller;

import com.prj.projectweb.dto.response.PaymentProofResponse;
import com.prj.projectweb.service.PaymentProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/payment-proofs")
public class PaymentProofController {

    @Autowired
    private PaymentProofService paymentProofService;

    @PostMapping("/upload")
    public ResponseEntity<PaymentProofResponse> uploadPaymentProof(
            @RequestParam("file") MultipartFile file,
            @RequestParam("uploadedBy") String uploadedBy) {
        PaymentProofResponse response = paymentProofService.uploadProof(file, uploadedBy);
        return ResponseEntity.ok(response);
    }
}
