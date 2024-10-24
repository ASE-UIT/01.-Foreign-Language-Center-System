package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.DownloadPaymentProofRequest;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.PaymentProof;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.exception.PaymentStatus;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.PaymentProofRepository;
import com.prj.projectweb.repositories.UserRepository;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File; 
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
public class PaymentProofService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;

    @Autowired
    private PaymentProofRepository paymentProofRepository;

    public int uploadPaymentProof(Long userId, Long courseRegistrationId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        // Kiểm tra role của người dùng
        if (!user.getRole().getRoleName().equals("NhanVienHoTroHocVu")) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        CourseRegistration courseRegistration = courseRegistrationRepository.findById(courseRegistrationId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_REGISTRATION_NOTFOUND));


        if (file.isEmpty()) {
            return 1;
        }

        // Xác thực loại file là ảnh
        String fileType = file.getContentType();
        if (!isValidImageType(fileType)) {
            return 2;
        }

        // Xác thực kích thước file (giới hạn  5MB)
        long maxSize = 5 * 1024 * 1024; 
        if (file.getSize() > maxSize) {
            return 3;
        }

        
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

        return 0;
    }

    private boolean isValidImageType(String fileType) {
        List<String> validImageTypes = Arrays.asList("image/png", "image/jpeg", "image/gif", "image/bmp", "image/tiff");
        return validImageTypes.contains(fileType);
    }

    public void downloadPaymentProof(DownloadPaymentProofRequest request) {
        PaymentProof paymentProof = paymentProofRepository.findById(request.getId())
                .orElseThrow(() -> new AppException(ErrorCode.PAYMENT_PROOF_NOTFOUND));
        
        // Đường dẫn lưu file
        String downloadDir = request.getSavePath();
        File directory = new File(downloadDir);
        
        // Tạo thư mục nếu chưa tồn tại
        if (!directory.exists()) {
            directory.mkdirs();
        }
        
        // Kiểm tra fileData
        if (paymentProof.getFileData() == null || paymentProof.getFileData().length == 0) {
            throw new RuntimeException("File data is empty or null.");
        }
    
        // Tạo file mới để lưu
        File file = new File(directory, paymentProof.getFileName());
    
        // Lưu file từ BLOB dữ liệu
        try (FileOutputStream fos = new FileOutputStream(file)) {
            fos.write(paymentProof.getFileData()); 
            fos.flush();
        } catch (IOException e) {
            throw new RuntimeException("Error while saving the payment proof file", e);
        }
    }
    
    
    
}

