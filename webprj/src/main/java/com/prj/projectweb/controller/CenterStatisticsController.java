package com.prj.projectweb.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CenterStatisticsResponse;
import com.prj.projectweb.service.CenterStatisticsService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/center-statistic")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CenterStatisticsController {
    CenterStatisticsService centerStatisticsService;

    @GetMapping("/{centerId}")
    public ResponseEntity<ApiResponse<CenterStatisticsResponse>> getCenterStatistics(@PathVariable("centerId") Long centerId) {
        CenterStatisticsResponse response = centerStatisticsService.getStatistics(centerId);
        return ResponseEntity.status((HttpStatus.OK)).body(
            ApiResponse.<CenterStatisticsResponse>builder()
            .code(HttpStatus.OK.value())
            .message("GET STATISTICS OF CENTER_ID = " + centerId)
            .result(response)
            .build()
        );
    }

}
