package com.prj.projectweb.dto.response;
import java.time.LocalDateTime;

import com.prj.projectweb.enumType.ExpenseType;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class ExpenseResponse {
    Long id;
    Long centerId;   
    String expenseName;
    Double amount;
    LocalDateTime paymentDate;
    String note;
    String type;
}
