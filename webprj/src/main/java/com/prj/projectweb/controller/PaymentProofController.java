package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.DownloadPaymentProofRequest;
import com.prj.projectweb.dto.request.UploadPaymentProofRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.service.PaymentProofService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment-proof")
public class PaymentProofController {

    @Autowired
    private PaymentProofService paymentProofService;


    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<String>> uploadPaymentProof(@ModelAttribute UploadPaymentProofRequest request) throws IOException {
        
        int result = paymentProofService.uploadPaymentProof(request.getUserId(), request.getCourseRegistrationId(), request.getFile());

        if (result == 1) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<String>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Only files with the following extensions are allowed: image/png, image/jpeg, image/gif, image/bmp, image/tiff.")
                    .result("FAILED")
                    .build()
            );
        } else if (result == 2) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<String>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("The maximum size is 5MB.")
                    .result("FAILED")
                    .build()
            );
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.<String>builder()
                    .code(HttpStatus.OK.value())
                    .message("Upload payment proof successfully")
                    .result("SUCCESS")
                    .build()
            );
        }
    }

    @GetMapping("/download")
    public ApiResponse<String> downloadPaymentProof(@RequestBody DownloadPaymentProofRequest request) {
        paymentProofService.downloadPaymentProof(request);
        return ApiResponse.<String>builder()
            .message("Download payment proof id = " + request.getId())
            .result("SUCCESS")
            .build();
    }
}
