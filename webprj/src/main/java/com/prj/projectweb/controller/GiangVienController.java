package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.service.GiangVienService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/giangvien")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GiangVienController {
    GiangVienService giangVienService;

    @PostMapping("/add")
    public ApiResponse<GiangVienResponse> addGiangVien(@RequestBody @Validated GiangVienDTO giangVienDTO) {
        return ApiResponse.<GiangVienResponse>builder()
                .message("add giangvien successfully")
                .result(giangVienService.addGiangVien(giangVienDTO))
                .build();
    }
}
