package com.prj.projectweb.controller;

import com.prj.projectweb.dto.response.FileBoardResponse;
import com.prj.projectweb.dto.request.FileBoardUploadRequest;
import com.prj.projectweb.service.FileBoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
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
    public ResponseEntity<FileBoardResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @ModelAttribute FileBoardUploadRequest requestDto) throws IOException {
        FileBoardResponse uploadedFile = fileBoardService.uploadFile(file, requestDto);
        return ResponseEntity.ok(uploadedFile);
    }

    @DeleteMapping("/delete/{fileId}")
    public ResponseEntity<String> deleteFile(
            @PathVariable Long fileId,
            @RequestParam("giangVienId") Long giangVienId) throws IOException {
        fileBoardService.deleteFile(fileId, giangVienId);
        return ResponseEntity.ok("File deleted successfully");
    }

    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) throws IOException {
        Resource resource = fileBoardService.downloadFile(fileName);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}