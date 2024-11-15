package com.prj.projectweb.service;

import com.prj.projectweb.dto.response.FileBoardResponse;
import com.prj.projectweb.dto.request.FileBoardDownloadRequest;
import com.prj.projectweb.dto.request.FileBoardUploadRequest;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.FileBoard;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.FileBoardMapper;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.FileBoardRepository;
import com.prj.projectweb.repositories.GiangVienRepository;

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
    private  FileBoardRepository fileBoardRepository;
    @Autowired
    private  GiangVienRepository giangVienRepository;

    @Autowired
    private CenterRepository centerRepository;

    @Autowired
    private FileBoardMapper fileBoardMapper;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileBoardResponse uploadFile(MultipartFile file, FileBoardUploadRequest requestDto) throws IOException {
        GiangVien giangVien = giangVienRepository.findById(requestDto.getGiangVienId())
            .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOTFOUND));

        if (giangVien == null) {
            throw new AppException(ErrorCode.TEACHER_NOTFOUND);
        }
            // Lấy thông tin Trung tâm
        Center center = centerRepository.findById(requestDto.getCenterId())
            .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir).resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        FileBoard fileBoard = FileBoard.builder()
                .filename(fileName)
                .filePath(filePath.toString())
                .downloadLink("/api/fileboard/download/" + fileName)
                .isPublic(requestDto.isPublic())
                .course(Course.builder().id(requestDto.getCourseId()).build())
                .giangVien(GiangVien.builder().id(requestDto.getGiangVienId()).build())
                .createdAt(LocalDateTime.now())
                .center(center) 
                .build();

        FileBoard savedFileBoard = fileBoardRepository.save(fileBoard);
        return fileBoardMapper.toDto(savedFileBoard);
    }

    public int deleteFile(Long fileId, Long giangVienId) throws IOException {
        FileBoard fileBoard = fileBoardRepository.findById(fileId)
                .orElseThrow(() -> new AppException(ErrorCode.FILE_NOTFOUND));

        if (!fileBoard.getGiangVien().getId().equals(giangVienId)) {
            return -1;
        }
        
        Files.delete(Paths.get(fileBoard.getFilePath()));
        fileBoardRepository.delete(fileBoard);
        
        return 0;
    }

    public boolean downloadFile(FileBoardDownloadRequest request) throws MalformedURLException, IOException {
        // Đường dẫn file trên server
        Path serverFilePath = Paths.get(uploadDir).resolve(request.getFileName());
        
        Resource resource = new UrlResource(serverFilePath.toUri());
    
        // Kiểm tra xem file có tồn tại và có thể đọc được không
        if (resource.exists() && resource.isReadable()) {
            Path destinationPath = Paths.get(request.getSavePath()).resolve(request.getFileName());
            
            Files.copy(resource.getInputStream(), destinationPath);
            
            return true;
        } else {
            throw new AppException(ErrorCode.FILE_NOTFOUND);
        }
    }
    
}