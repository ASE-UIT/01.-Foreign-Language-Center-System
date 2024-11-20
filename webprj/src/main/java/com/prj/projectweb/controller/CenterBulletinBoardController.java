package com.prj.projectweb.controller;


import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.request.CreateBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.service.CenterBulletinBoardService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/bulletin-board/center")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CenterBulletinBoardController {
    CenterBulletinBoardService centerBulletinBoardService;

    @PostMapping
    public ApiResponse<CenterBulletinBoardResponse> create(@RequestBody CreateBulletinBoardRequest request) {
        return ApiResponse.<CenterBulletinBoardResponse>builder()
                .result(centerBulletinBoardService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CenterBulletinBoardResponse> update(@PathVariable("id") Long id, @RequestBody UpdateBulletinBoardRequest request) {
        return ApiResponse.<CenterBulletinBoardResponse>builder()
                .result(centerBulletinBoardService.update(id, request))
                .build();
    }
}
