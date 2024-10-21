package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.PaymentProofRequest;
import com.prj.projectweb.dto.response.PaymentProofResponse;
import com.prj.projectweb.entities.PaymentProof;
import com.prj.projectweb.mapper.PaymentProofMapper;
import com.prj.projectweb.repositories.PaymentProofRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class PaymentProofService {

    @Autowired
    private PaymentProofRepository paymentProofRepository;

    @Autowired
    private PaymentProofMapper paymentProofMapper;

    public PaymentProofResponse uploadProof(MultipartFile file, String uploadedBy) {
        try {
            byte[] fileData = file.getBytes();
            PaymentProofRequest request = new PaymentProofRequest();
            request.setFile(file);
            request.setUploadedBy(uploadedBy);

            PaymentProof paymentProof = paymentProofMapper.toEntity(request, fileData);
            paymentProof = paymentProofRepository.save(paymentProof);

            return paymentProofMapper.toResponse(paymentProof);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }
}
