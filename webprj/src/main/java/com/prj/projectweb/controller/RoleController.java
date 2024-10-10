package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.RoleRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.entities.Role;
import com.prj.projectweb.service.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RoleController {

    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    // Lấy tất cả các vai trò
    @GetMapping
    public ApiResponse<List<RoleResponse>> getAllRoles() {
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAll())
                .build();
    }

    // Tìm vai trò theo ID
    @GetMapping("/{id}")
    public ApiResponse<RoleResponse> getRoleById(@PathVariable Long id) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.getRoleById(id))
                .build();
    }

    // Thêm vai trò mới
    @PostMapping
    public ApiResponse<RoleResponse> addRole(@RequestBody RoleRequest role) {
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.addRole(role))
                .build();
    }

    // them list role
    @PostMapping("/addList")
    public ApiResponse addListRoles(@RequestBody List<RoleRequest> requests) {
        roleService.addListRole(requests);
        return ApiResponse.builder()
                .message("add " + requests.size() + " roles successfully")
                .build();
    }

    // Cập nhật vai trò
    @PutMapping("/{id}")
    public ApiResponse<RoleResponse> updateRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        return ApiResponse.<RoleResponse>builder()
                .message("update roles succussfully")
                .result(roleService.updateRole(id, request))
                .build();
    }

    // Xóa vai trò
    @DeleteMapping("/{id}")
    public ApiResponse deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ApiResponse.builder()
                .message("delete role with " + id + " successfully")
                .build();
    }
}
