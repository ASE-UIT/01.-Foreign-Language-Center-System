package com.prj.projectweb.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GiangVienResponse {
    Long id;
    String name;
    LocalDate dob;
    Long accountId;
}
