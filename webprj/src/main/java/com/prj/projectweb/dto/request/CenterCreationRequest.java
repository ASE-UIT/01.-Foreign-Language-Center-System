package com.prj.projectweb.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CenterCreationRequest {
    String name;
    String address;
    String phone;
    String email;
    String managerName;
}
