package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.RefundRequest;
import com.prj.projectweb.dto.response.RefundResponse;
import com.prj.projectweb.entities.Refund;
import com.prj.projectweb.exception.RefundAmount;
import com.prj.projectweb.mapper.RefundMapper;
import com.prj.projectweb.repositories.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RefundService {
    @Autowired
    private RefundRepository refundRepository;

    @Autowired
    private RefundMapper refundMapper;

    public RefundResponse processRefund(RefundRequest request) {
        // Chuyển đổi từ dto sang Entity bằng MapStruct
        Refund refundEntity = refundMapper.toEntity(request);

        // Thực hiện các bước xử lý hoàn tiền ở đây
        String studentEmail = request.getStudentEmail();
        String courseName = request.getCourseName();
        String reason = request.getReason();
        RefundAmount refundAmountType = request.getRefundAmount();

        // Tính toán số tiền hoàn lại
        double refundAmount = calculateRefundAmount(refundAmountType);

        // Logic hoàn tiền sẽ ở đây
        // Giả sử có một phương thức để hoàn tiền
        // refundStudent(studentEmail, courseName, refundAmount);

        String message = "Hoàn tiền thành công cho học viên " + studentEmail + " cho khóa học " + courseName;

        // Lưu vào cơ sở dữ liệu
        refundRepository.save(refundEntity);

        // Trả về đối tượng RefundResponse
        return new RefundResponse(message, studentEmail, courseName, refundAmount, reason);
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



