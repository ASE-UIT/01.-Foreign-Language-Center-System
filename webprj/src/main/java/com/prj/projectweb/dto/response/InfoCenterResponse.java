package com.prj.projectweb.dto.response;
import lombok.*;
import lombok.experimental.FieldDefaults;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class InfoCenterResponse {
    Long id;
    String name;
    String address;
    String email;
}
