package com.prj.projectweb.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.request.CreateGlobalBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.service.GlobalBulletinBoardService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/bulletin-board/global")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GlobalBulletinBoardController {
    GlobalBulletinBoardService globalBulletinBoardService;

    @PostMapping
    public ApiResponse<CenterBulletinBoardResponse> create (@RequestBody CreateGlobalBulletinBoardRequest request) {
                return ApiResponse.<CenterBulletinBoardResponse>builder()
                .result(globalBulletinBoardService.create(request))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CenterBulletinBoardResponse> update(@PathVariable("id") Long id, @RequestBody UpdateBulletinBoardRequest request) {
        return ApiResponse.<CenterBulletinBoardResponse>builder()
                .result(globalBulletinBoardService.update(id, request))
                .build();
    }
}
