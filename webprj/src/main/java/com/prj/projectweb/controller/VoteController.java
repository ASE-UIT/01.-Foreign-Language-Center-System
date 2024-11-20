package com.prj.projectweb.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.request.VoteCourseRequest;
import com.prj.projectweb.dto.request.VoteGiangVienRequest;
import com.prj.projectweb.dto.response.VoteInfoResponse;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.GiangVienWithVote;
import com.prj.projectweb.service.VoteService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/vote")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VoteController {
    VoteService voteService;

    @PostMapping("/giangVien")
    public ResponseEntity<ApiResponse<String>> voteForGiangVien(@RequestBody VoteGiangVienRequest request) {
        boolean result = voteService.voteForGiangVien(request);
        if (!result) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<String>builder()
                    .message("Vote for giangvien with id =  " + request.getGiangVienId())
                    .result("FAILED")
                    .code(HttpStatus.BAD_REQUEST.value())
                    .build()
            );
        }

        return ResponseEntity.status(HttpStatus.OK).body(
            ApiResponse.<String>builder()
                .message("Vote for giangvien with id =  " + request.getGiangVienId())
                .result("SUCCESS")
                .code(HttpStatus.OK.value())
                .build()
        );
    }

    @PostMapping("/course")
    public ResponseEntity<ApiResponse<String>> voteForCourse(@RequestBody VoteCourseRequest request) {
        boolean result = voteService.voteForCourse(request);
        if (!result) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                ApiResponse.<String>builder()
                    .message("Vote for course with id =  " + request.getCourseId())
                    .result("FAILED")
                    .code(HttpStatus.BAD_REQUEST.value())
                    .build()
            );
        }

        return ResponseEntity.status(HttpStatus.OK).body(
            ApiResponse.<String>builder()
                .message("Vote for course with id =  " + request.getCourseId())
                .result("SUCCESS")
                .code(HttpStatus.OK.value())
                .build()
        );
    }

    @GetMapping("/giangVien/{id}")
    public ApiResponse<List<GiangVienWithVote>> getListGiangVien(@PathVariable("id") Long id) {
        List<GiangVienWithVote> result = voteService.getListGiangVien(id);
        return ApiResponse.<List<GiangVienWithVote>>builder()
                    .message(result.size() + " giang vien")
                    .result(result)
                    .build();

    }
    @GetMapping("/course/{id}")
    public ApiResponse<List<VoteInfoResponse>> getListCourse(@PathVariable("id") Long id) {
        List<VoteInfoResponse> result = voteService.getListCourse(id);
        return ApiResponse.<List<VoteInfoResponse>>builder()
                    .message(result.size() + " course")
                    .result(result)
                    .build();

    }
}
