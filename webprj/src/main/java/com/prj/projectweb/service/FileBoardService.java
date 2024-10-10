package com.prj.projectweb.service;

import com.prj.projectweb.dto.response.FileBoardResponse;
import com.prj.projectweb.dto.request.FileBoardUploadRequest;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.FileBoard;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.mapper.FileBoardMapper;
import com.prj.projectweb.repositories.FileBoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class FileBoardService {

    @Autowired
    private FileBoardRepository fileBoardRepository;

    @Autowired
    private FileBoardMapper fileBoardMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileBoardResponse uploadFile(MultipartFile file, FileBoardUploadRequest requestDto) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        FileBoard fileBoard = FileBoard.builder()
                .filename(file.getOriginalFilename())
                .filePath(filePath.toString())
                .downloadLink("/api/fileboard/download/" + fileName)
                .isPublic(requestDto.isPublic())
                .course(Course.builder().id(requestDto.getCourseId()).build())
                .giangVien(GiangVien.builder().id(requestDto.getGiangVienId()).build())
                .createdAt(LocalDateTime.now())
                .build();

        FileBoard savedFileBoard = fileBoardRepository.save(fileBoard);
        return fileBoardMapper.toDto(savedFileBoard);
    }

    public void deleteFile(Long fileId, Long giangVienId) throws IOException {
        FileBoard fileBoard = fileBoardRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        if (!fileBoard.getGiangVien().getId().equals(giangVienId)) {
            throw new RuntimeException("You don't have permission to delete this file");
        }

        Files.delete(Paths.get(fileBoard.getFilePath()));
        fileBoardRepository.delete(fileBoard);
    }

    public Resource downloadFile(String fileName) throws MalformedURLException {
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Resource resource = new UrlResource(filePath.toUri());

        if (resource.exists() && resource.isReadable()) {
            return resource;
        } else {
            throw new RuntimeException("File not found: " + fileName);
        }
    }
}