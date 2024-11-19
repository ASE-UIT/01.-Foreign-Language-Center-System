package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.SalaryRequest;
import com.prj.projectweb.dto.response.SalaryResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Salary;
import com.prj.projectweb.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-20T00:23:30+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241023-1306, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class SalaryMapperImpl implements SalaryMapper {

    @Override
    public Salary toEntity(SalaryRequest salaryRequest) {
        if ( salaryRequest == null ) {
            return null;
        }

        Salary.SalaryBuilder salary = Salary.builder();

        salary.user( salaryRequestToUser( salaryRequest ) );
        salary.center( salaryRequestToCenter( salaryRequest ) );
        salary.allowance( salaryRequest.getAllowance() );
        salary.baseSalary( salaryRequest.getBaseSalary() );
        salary.coefficient( salaryRequest.getCoefficient() );
        salary.year( salaryRequest.getYear() );

        return salary.build();
    }

    @Override
    public SalaryResponse toResponse(Salary salary) {
        if ( salary == null ) {
            return null;
        }

        SalaryResponse.SalaryResponseBuilder salaryResponse = SalaryResponse.builder();

        salaryResponse.userId( salaryUserUserId( salary ) );
        salaryResponse.centerId( salaryCenterId( salary ) );
        salaryResponse.allowance( salary.getAllowance() );
        salaryResponse.baseSalary( salary.getBaseSalary() );
        salaryResponse.coefficient( salary.getCoefficient() );
        salaryResponse.id( salary.getId() );
        salaryResponse.year( salary.getYear() );

        salaryResponse.totalSalary( calculateTotalSalary(salary) );

        return salaryResponse.build();
    }

    protected User salaryRequestToUser(SalaryRequest salaryRequest) {
        if ( salaryRequest == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.userId( salaryRequest.getUserId() );

        return user.build();
    }

    protected Center salaryRequestToCenter(SalaryRequest salaryRequest) {
        if ( salaryRequest == null ) {
            return null;
        }

        Center.CenterBuilder center = Center.builder();

        center.id( salaryRequest.getCenterId() );

        return center.build();
    }

    private Long salaryUserUserId(Salary salary) {
        User user = salary.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getUserId();
    }

    private Long salaryCenterId(Salary salary) {
        Center center = salary.getCenter();
        if ( center == null ) {
            return null;
        }
        return center.getId();
    }
}
