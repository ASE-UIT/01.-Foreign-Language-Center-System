package com.prj.projectweb.controller;

import com.nimbusds.jose.JOSEException;
import com.prj.projectweb.dto.request.IntrospectRequest;
import com.prj.projectweb.dto.request.LoginRequest;
import com.prj.projectweb.dto.request.LogoutRequest;
import com.prj.projectweb.dto.request.RefreshRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.AuthenticationResponse;
import com.prj.projectweb.dto.response.IntrospectResponse;
import com.prj.projectweb.dto.response.LoginResponse;
import com.prj.projectweb.service.AuthenticationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.text.ParseException;

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

        @PostMapping("/introspect")
    ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request)
            throws ParseException, JOSEException {
        IntrospectResponse result = authenticationService.introspect(request);

        return ApiResponse.<IntrospectResponse>builder().result(result).build();
    }

    @PostMapping("/refresh")
    ApiResponse<AuthenticationResponse> refresh(@RequestBody RefreshRequest request)
            throws ParseException, JOSEException {
        AuthenticationResponse result = authenticationService.refreshToken(request);

        return ApiResponse.<AuthenticationResponse>builder().result(result).build();
    }

    @PostMapping("/logout")
    ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
        authenticationService.logout(request);

        return ApiResponse.<Void>builder().build();
    }
}
