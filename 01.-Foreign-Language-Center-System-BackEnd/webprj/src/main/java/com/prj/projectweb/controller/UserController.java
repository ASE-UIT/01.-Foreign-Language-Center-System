package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.ChangePasswordRequest;
import com.prj.projectweb.dto.request.UserCreationRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.dto.response.UserResponse;
import com.prj.projectweb.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {

    UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("User created successfully")
                .result(userService.createUser(request)).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getInfoById(@PathVariable Long id) {
        return ApiResponse.<UserResponse>builder()
                .result(userService.getInfoById(id))
                .build();
    }

    @PutMapping("/changePass")
    public ApiResponse<String> changePassword(@RequestBody ChangePasswordRequest request) {
        return ApiResponse.<String>builder()
                .result(userService.changePassword(request))
                .build();
    }
}

