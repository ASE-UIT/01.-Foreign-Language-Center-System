package com.prj.projectweb.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.request.CenterCreationRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CenterResponse;
import com.prj.projectweb.service.CenterService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/center")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CenterController {
    CenterService centerService;

    @PostMapping
    public ApiResponse<CenterResponse> createCenter(@RequestBody CenterCreationRequest request) {
        CenterResponse response = centerService.createCenter(request);
        return ApiResponse.<CenterResponse>builder()
                .result(response)
                .build();
    }
}
