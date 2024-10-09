package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.RoleRequest;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.entities.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);
    RoleResponse toRoleResponse(Role role);
}
