package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.LoginRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.LoginResponse;
import com.prj.projectweb.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login (@RequestBody LoginRequest request) {
        return ApiResponse.<LoginResponse>builder()
                .message("login successfully")
                .result(authenticationService.login(request))
                .build();
    }
}
