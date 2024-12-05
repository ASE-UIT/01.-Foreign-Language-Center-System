package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.ExpenseRequest;
import com.prj.projectweb.dto.response.ExpenseResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Expense;
import com.prj.projectweb.enumType.ExpenseType;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-05T09:11:21+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class ExpenseMapperImpl implements ExpenseMapper {

    @Override
    public Expense toEntity(ExpenseRequest expenseRequest) {
        if ( expenseRequest == null ) {
            return null;
        }

        Expense.ExpenseBuilder expense = Expense.builder();

        expense.center( expenseRequestToCenter( expenseRequest ) );
        expense.amount( expenseRequest.getAmount() );
        expense.expenseName( expenseRequest.getExpenseName() );
        expense.note( expenseRequest.getNote() );
        expense.paymentDate( expenseRequest.getPaymentDate() );
        if ( expenseRequest.getType() != null ) {
            expense.type( Enum.valueOf( ExpenseType.class, expenseRequest.getType() ) );
        }

        return expense.build();
    }

    @Override
    public ExpenseResponse toResponse(Expense expense) {
        if ( expense == null ) {
            return null;
        }

        ExpenseResponse.ExpenseResponseBuilder expenseResponse = ExpenseResponse.builder();

        expenseResponse.centerId( expenseCenterId( expense ) );
        expenseResponse.amount( expense.getAmount() );
        expenseResponse.expenseName( expense.getExpenseName() );
        expenseResponse.id( expense.getId() );
        expenseResponse.note( expense.getNote() );
        expenseResponse.paymentDate( expense.getPaymentDate() );
        if ( expense.getType() != null ) {
            expenseResponse.type( expense.getType().name() );
        }

        return expenseResponse.build();
    }

    protected Center expenseRequestToCenter(ExpenseRequest expenseRequest) {
        if ( expenseRequest == null ) {
            return null;
        }

        Center.CenterBuilder center = Center.builder();

        center.id( expenseRequest.getCenterId() );

        return center.build();
    }

    private Long expenseCenterId(Expense expense) {
        Center center = expense.getCenter();
        if ( center == null ) {
            return null;
        }
        return center.getId();
    }
}
