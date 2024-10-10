package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.service.GiangVienService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/addList")
    public ApiResponse<List<String>> addList(@RequestBody List<GiangVienDTO> requests) throws Exception {
        List<String> names = giangVienService.addList(requests);

        return ApiResponse.<List<String>>builder()
                .message("add " + names.size() + " giangvien successfully")
                .result(names)
                .build();
    }

    @GetMapping("/get/{id}")
    public ApiResponse<GiangVienResponse> getById(@PathVariable("id") Long id) throws Exception {
        return ApiResponse.<GiangVienResponse>builder()
                .result(giangVienService.getById(id))
                .build();
    }
    @GetMapping("/getList")
    public ApiResponse<List<GiangVienResponse>> getList() throws Exception {
        return ApiResponse.<List<GiangVienResponse>>builder()
                .result(giangVienService.getList())
                .build();
    }
}
