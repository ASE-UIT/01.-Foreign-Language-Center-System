package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.RefundRequest;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.enumType.RegistrationStatus;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.UserRepository;
import com.prj.projectweb.utils.UtilsHandleEmail;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class RefundService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRegistrationRepository courseRegistrationRepository;

    @Autowired
    private UtilsHandleEmail utilsHandleEmail;

    public String processRefund(RefundRequest refundRequest) throws MessagingException {
        // Tìm học viên dựa trên email
        User user = userRepository.findByEmail(refundRequest.getStudentEmail())
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        if (user == null) {
            throw new AppException(ErrorCode.USER_NOTFOUND);
        }

        // Tìm khóa học đã đăng ký dựa trên courseId
        Optional<CourseRegistration> registrationOptional = courseRegistrationRepository.findByStudent_UserIdAndCourse_Id(user.getUserId(), refundRequest.getCourseId());
        if (registrationOptional.isEmpty()) {
            throw new AppException(ErrorCode.REGISTRATION_NOT_FOUND);
        }
        CourseRegistration registration = registrationOptional.get();

        // Tính toán số tiền hoàn lại dựa trên mức refund (cần chuyển RefundAmount thành chuỗi nếu cần)
        Double refundAmount = calculateRefundAmount(registration.getPaidAmount(), refundRequest.getRefundAmount().toString());

        // Gửi email thông báo về hoàn tiền
        String subject = "XÁC NHẬN HOÀN TIỀN KHÓA HỌC";
        String text = String.format("Xin chào %s,\n\nKhóa học %s của bạn đã bị hủy với lý do: %s.\nSố tiền bạn sẽ được hoàn lại: %.2f.",
                user.getFullName(), registration.getCourse().getCourseName(), refundRequest.getReason(), refundAmount);

        utilsHandleEmail.sendPayment(user.getEmail(), subject, text);

        // Cập nhật trạng thái đăng ký khóa học
        registration.setStatus(RegistrationStatus.REFUNDED);
        log.info("STATUS: " + registration.getStatus());
        
        courseRegistrationRepository.save(registration);

        return "Refund processed successfully";
    }

    // Phương thức tính số tiền hoàn lại
    private Double calculateRefundAmount(Double paidAmount, String refundType) {
        switch (refundType.toLowerCase()) {
            case "full":
                return paidAmount;
            case "quarter":
                return paidAmount / 4;
            case "half":
                return paidAmount / 2;
            default:
                throw new IllegalArgumentException("Invalid refund type");
        }
    }
}
