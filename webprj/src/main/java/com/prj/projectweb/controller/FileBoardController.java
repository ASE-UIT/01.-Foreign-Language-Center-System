package com.prj.projectweb.controller;

import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.ChatMessageResponse;
import com.prj.projectweb.dto.response.FileBoardResponse;
import com.prj.projectweb.dto.request.FileBoardDownloadRequest;
import com.prj.projectweb.dto.request.FileBoardUploadRequest;
import com.prj.projectweb.service.FileBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/fileboard")
public class FileBoardController {

    @Autowired
    private FileBoardService fileBoardService;

    @PostMapping("/upload")
    public ApiResponse<FileBoardResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @ModelAttribute FileBoardUploadRequest requestDto) throws IOException {
        FileBoardResponse uploadedFile = fileBoardService.uploadFile(file, requestDto);
        return ApiResponse.<FileBoardResponse>builder()
        .message("upload file successfully")
        .result(uploadedFile)
        .build();
    }

    @DeleteMapping("/delete/{fileId}")
    public ResponseEntity<ApiResponse<String>> deleteFile(
            @PathVariable Long fileId,
            @RequestParam("giangVienId") Long giangVienId) throws IOException {
        int result = fileBoardService.deleteFile(fileId, giangVienId);
        if (result == 0) {
            return ResponseEntity.status((HttpStatus.FORBIDDEN)).body(
                ApiResponse.<String>builder()
                    .result("Delete this file failed")
                    .code(HttpStatus.FORBIDDEN.value())
                    .message("You dont have permission to delete this file.")
                    .build()
            );
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.<String>builder()
                .result("Delete this file successfully ")
                .code(HttpStatus.CREATED.value())
                .build()
        );
    }

    @GetMapping("/download")
    public ResponseEntity<ApiResponse<String>> downloadFile(@RequestBody FileBoardDownloadRequest request) throws IOException {
        boolean isDownloaded = fileBoardService.downloadFile(request);
        
        if (isDownloaded) {
            return ResponseEntity.status((HttpStatus.OK)).body(
                ApiResponse.<String>builder()
                    .code(HttpStatus.OK.value())
                    .result("File downloaded successfully at: " + request.getSavePath())
                    .build()
            );
        } else {
            return ResponseEntity.status((HttpStatus.INTERNAL_SERVER_ERROR)).body(
                ApiResponse.<String>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .result("Failed to download the file.")
                    .build()
            );
        }
    }
    
}