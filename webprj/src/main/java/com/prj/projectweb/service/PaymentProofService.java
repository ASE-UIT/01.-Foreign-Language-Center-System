package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.PaymentProofRequest;
import com.prj.projectweb.dto.response.PaymentProofResponse;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.PaymentProof;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.PaymentStatus;
import com.prj.projectweb.mapper.PaymentProofMapper;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.PaymentProofRepository;
import com.prj.projectweb.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;

@Service
public class PaymentProofService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;

    @Autowired
    private PaymentProofRepository paymentProofRepository;

    public void uploadPaymentProof(Long userId, Long courseRegistrationId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Kiểm tra role của người dùng
        if (!user.getRole().getRoleName().equals("NhanVienHoTroHocVu")) {
            throw new RuntimeException("Bạn không có quyền upload");
        }

        CourseRegistration courseRegistration = courseRegistrationRepository.findById(courseRegistrationId)
                .orElseThrow(() -> new RuntimeException("Course registration not found"));

        // Tạo và lưu ảnh minh chứng
        PaymentProof paymentProof = new PaymentProof();
        paymentProof.setFileName(file.getOriginalFilename());
        paymentProof.setFileType(file.getContentType());
        paymentProof.setFileData(file.getBytes());
        paymentProof.setUploadedBy(user.getFullName());
        paymentProof.setUploadTime(LocalDateTime.now());
        paymentProof.setCourseRegistration(courseRegistration);

        // Lưu ID người upload
        paymentProof.setUserId(user.getUserId());
        
        // Lưu thông tin vào CSDL
        paymentProofRepository.save(paymentProof);

        // Cập nhật trạng thái học viên
        courseRegistration.setHasPaid(true);
        courseRegistration.setPaymentStatus(PaymentStatus.PAID);
        courseRegistrationRepository.save(courseRegistration);
    }
}

