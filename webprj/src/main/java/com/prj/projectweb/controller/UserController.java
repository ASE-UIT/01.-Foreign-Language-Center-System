package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.ChangePasswordRequest;
import com.prj.projectweb.dto.request.UserCreationRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.dto.response.ScheduleResponse;
import com.prj.projectweb.dto.response.UserResponse;
import com.prj.projectweb.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserController {

    UserService userService;

    @PostMapping
    public ApiResponse<UserResponse> createUser(@RequestBody UserCreationRequest request) {
        return ApiResponse.<UserResponse>builder()
                .message("User created successfully")
                .result(userService.createUser(request)).build();
    }

    @GetMapping("/{id}")
    public ApiResponse<UserResponse> getInfoById(@PathVariable("id") Long id) {
        log.info("in controller get info user");
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

    @GetMapping("/schedule/{id}")
    public ApiResponse<List<ScheduleResponse>> getWeeklySchedule(@PathVariable Long id) {
        return ApiResponse.<List<ScheduleResponse>>builder()
                .message("Weekly schedule retrieved successfully")
                .result(userService.getWeeklySchedule(id))
                .build();
    }

    @GetMapping("/courseRegistration/{id}")
    public ApiResponse<List<ScheduleResponse>> getCourseRegistration(@PathVariable Long id) {
        return ApiResponse.<List<ScheduleResponse>>builder()
                .message("Get course registratrion successfully")
                .result(userService.getCourseRegistration(id))
                .build();
    }
}


