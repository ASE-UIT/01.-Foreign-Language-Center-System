package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.RefundRequest;
import com.prj.projectweb.entities.Refund;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-24T19:13:11+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.v20240919-1711, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class RefundMapperImpl implements RefundMapper {

    @Override
    public Refund toEntity(RefundRequest request) {
        if ( request == null ) {
            return null;
        }

        Refund refund = new Refund();

        refund.setCourseName( request.getCourseName() );
        refund.setReason( request.getReason() );
        refund.setStudentEmail( request.getStudentEmail() );

        refund.setRefundAmount( calculateRefundAmount(request.getRefundAmount()) );

        return refund;
    }
}
