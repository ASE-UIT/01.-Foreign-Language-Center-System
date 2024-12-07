package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.SalaryPaymentRequest;
import com.prj.projectweb.dto.response.SalaryPaymentResponse;
import com.prj.projectweb.entities.Salary;
import com.prj.projectweb.entities.SalaryPayment;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-07T11:44:11+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class SalaryPaymentMapperImpl implements SalaryPaymentMapper {

    @Override
    public SalaryPayment toEntity(SalaryPaymentRequest request) {
        if ( request == null ) {
            return null;
        }

        SalaryPayment.SalaryPaymentBuilder salaryPayment = SalaryPayment.builder();

        salaryPayment.amountPaid( request.getAmountPaid() );
        salaryPayment.month( request.getMonth() );
        salaryPayment.paymentDate( request.getPaymentDate() );
        salaryPayment.userId( request.getUserId() );
        salaryPayment.salary( salaryPaymentRequestToSalary( request ) );

        return salaryPayment.build();
    }

    @Override
    public SalaryPaymentResponse toResponse(SalaryPayment salaryPayment) {
        if ( salaryPayment == null ) {
            return null;
        }

        SalaryPaymentResponse.SalaryPaymentResponseBuilder salaryPaymentResponse = SalaryPaymentResponse.builder();

        salaryPaymentResponse.salaryId( salaryPaymentSalaryId( salaryPayment ) );
        salaryPaymentResponse.amountPaid( salaryPayment.getAmountPaid() );
        salaryPaymentResponse.id( salaryPayment.getId() );
        salaryPaymentResponse.isPaid( salaryPayment.getIsPaid() );
        salaryPaymentResponse.paymentDate( salaryPayment.getPaymentDate() );
        salaryPaymentResponse.userId( salaryPayment.getUserId() );

        return salaryPaymentResponse.build();
    }

    protected Salary salaryPaymentRequestToSalary(SalaryPaymentRequest salaryPaymentRequest) {
        if ( salaryPaymentRequest == null ) {
            return null;
        }

        Salary.SalaryBuilder salary = Salary.builder();

        return salary.build();
    }

    private Long salaryPaymentSalaryId(SalaryPayment salaryPayment) {
        Salary salary = salaryPayment.getSalary();
        if ( salary == null ) {
            return null;
        }
        return salary.getId();
    }
}
