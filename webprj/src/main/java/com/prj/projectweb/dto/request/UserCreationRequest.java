package com.prj.projectweb.dto.request;

import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.entities.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String email;
    String fullName;
    String phone;
    String address;
    LocalDate dob;
    String image;

    int flag;
//    String role;

    // Dành cho Học Sinh: ID của Phụ Huynh
    Long parentId;
    Long centerId;
}
