package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.PermissionRequest;
import com.prj.projectweb.dto.response.PermissionResponse;
import com.prj.projectweb.entities.Permission;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PermissionMapper {
    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
