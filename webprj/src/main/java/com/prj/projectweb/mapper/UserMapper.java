package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.UserCreationRequest;
import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.dto.response.UserResponse;
import com.prj.projectweb.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.awt.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "role", ignore = true)
    User toUser(UserCreationRequest request);

    @Mapping(target = "role", source = "role.roleName")
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "centerId", source = "center.id")
    UserResponse toUserResponse(User user);

    @Mapping(source = "userId", target = "id")
    @Mapping(source = "fullName", target = "name")
    ChildOfParentResponse toChildOfParentResponse(User child);
}
