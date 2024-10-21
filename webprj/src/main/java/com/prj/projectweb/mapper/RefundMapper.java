package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.RefundRequest;
import com.prj.projectweb.entities.Refund;
import com.prj.projectweb.exception.RefundAmount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RefundMapper {

    @Mapping(target = "refundAmount", expression = "java(calculateRefundAmount(request.getRefundAmount()))")
    Refund toEntity(RefundRequest request);

    default double calculateRefundAmount(RefundAmount refundAmount) {
        double totalAmount = 1000; // Giả sử tổng tiền khóa học là 1000
        switch (refundAmount) {
            case FULL:
                return totalAmount;
            case QUARTER:
                return totalAmount / 4;
            case HALF:
                return totalAmount / 2;
            default:
                return 0;
        }
    }
}

