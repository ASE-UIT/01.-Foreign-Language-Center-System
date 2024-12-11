package com.prj.projectweb.dto.request;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CenterCreationRequest {
    Long userId;
    String name;
    String address;
    String ward;  
    String district; 
    String city;    
    String email;
}
