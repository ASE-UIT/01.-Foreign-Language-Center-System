package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.RoleRequest;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.entities.Permission;
import com.prj.projectweb.entities.Role;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.RoleMapper;
import com.prj.projectweb.repositories.PermissionRepository;
import com.prj.projectweb.repositories.RoleRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoleService {
    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    public RoleResponse addRole(RoleRequest request) {
        if (roleRepository.existsByRoleName(request.getRoleName())) {
            throw new AppException(ErrorCode.ROLE_EXISTED);
        }

        var role = roleMapper.toRole(request);

        var permissions =  permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        role = roleRepository.save(role);

        return roleMapper.toRoleResponse(role);
    }

    public void addListRole(List<RoleRequest> requests) {

        for (RoleRequest request : requests) {
            addRole(request);
        }

    }

    public List<RoleResponse> getAll() {
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    public RoleResponse getRoleById(Long id) {
        return roleMapper.toRoleResponse(roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND)));
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }


    @Transactional
    public RoleResponse updateRole(Long id, RoleRequest request) {
        log.info("in service Updating Role with ID: {}", id);

        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOTFOUND));


        existingRole.setRoleName(request.getRoleName());

        // Cập nhật Permissions nếu được cung cấp trong request
        if (request.getPermissions() != null) {
            var permissions =  permissionRepository.findAllById(request.getPermissions());

            // Kiểm tra nếu số lượng Permission tìm được khớp với số lượng trong request
            if (permissions.size() != request.getPermissions().size()) {
                throw new AppException(ErrorCode.PERMISSION_NOTFOUND);
            }

            existingRole.setPermissions(new HashSet<>(permissions));
        }

        // Lưu Role đã cập nhật vào cơ sở dữ liệu
        Role updatedRole = roleRepository.save(existingRole);

        return roleMapper.toRoleResponse(updatedRole);
    }
}
