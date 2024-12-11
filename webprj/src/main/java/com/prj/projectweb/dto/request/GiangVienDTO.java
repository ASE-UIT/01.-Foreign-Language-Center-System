package com.prj.projectweb.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GiangVienDTO {
    Long userId;
    String name;
    LocalDate dob;
    String image;
}
