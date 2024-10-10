package com.prj.projectweb.service;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.prj.projectweb.dto.request.LoginRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.dto.response.LoginResponse;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        if (!userRepository.existsByEmail(request.getEmail()))
            throw  new AppException(ErrorCode.EMAIL_WRONG);

        User user = userRepository.findByEmail(request.getEmail());

        if (!user.getPassword().equals(request.getPassword()))
            throw  new AppException(ErrorCode.PASSWORD_WRONG);

        String role = user.getRole().getRoleName();
        List<ChildOfParentResponse> child = null;

        if ("PhuHuynh".equals(role)) {
            List<User> listUser = userRepository.findAllByParentId(user.getUserId());
            child = listUser.stream()
                    .map(child1 -> ChildOfParentResponse.builder()
                            .id(child1.getUserId())
                            .name(child1.getFullName())
                            .build())
                    .collect(Collectors.toList());
        }

        return LoginResponse.builder()
                .role(role)
                .child(child)
                .build();
    }
}
