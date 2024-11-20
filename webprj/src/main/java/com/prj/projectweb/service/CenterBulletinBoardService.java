package com.prj.projectweb.service;

import java.util.*;

import org.springframework.stereotype.Service;

import com.prj.projectweb.dto.request.CreateBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.CenterBulletinBoard;
import com.prj.projectweb.entities.GlobalBulletinBoard;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.exception.ResourceNotFoundException;
import com.prj.projectweb.mapper.CenterBulletinBoardMapper;
import com.prj.projectweb.repositories.CenterBulletinBoardRepository;
import com.prj.projectweb.repositories.CenterRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CenterBulletinBoardService {
    CenterBulletinBoardRepository centerBulletinBoardRepository;
    CenterRepository centerRepository;
    CenterBulletinBoardMapper centerBulletinBoardMapper;

    public CenterBulletinBoardResponse create(CreateBulletinBoardRequest request) {
        // Kiểm tra quyền truy cập: User vai trò là BanDieuHanh hoặc BanLanhDao
        

        // Lấy trung tâm từ ID
        Center center = centerRepository.findById(request.getCenterId())
                .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        // Tạo bảng tin từ DTO
        CenterBulletinBoard centerBulletinBoard = centerBulletinBoardMapper.toEntity(request);
        centerBulletinBoard.setCenter(center);

        centerBulletinBoardRepository.save(centerBulletinBoard);
        
        return centerBulletinBoardMapper.toResponse(centerBulletinBoard);
    }

    public CenterBulletinBoardResponse update(Long id, UpdateBulletinBoardRequest request) {
        // Kiểm tra quyền truy cập


        // Tìm bảng tin
        CenterBulletinBoard centerBulletinBoard = centerBulletinBoardRepository.findById(id)
                                    .orElseThrow(() -> new AppException(ErrorCode.CENTER_BULLETIN_BOARD_NOTFOUND));


        // Chỉ cho phép chỉnh sửa bảng tin chưa hoàn thành
        if (centerBulletinBoard.getStatus() == CenterBulletinBoard.Status.COMPLETED) {
            throw new IllegalArgumentException("Cannot edit a completed bulletin board.");
        }

        // Kiểm tra và cập nhật các trường từ request nếu có
        if (request.getName() != null) {
            centerBulletinBoard.setName(request.getName());
        }
        if (request.getContent() != null) {
            centerBulletinBoard.setContent(request.getContent());
        }
        if (request.getStartDate() != null) {
            centerBulletinBoard.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            centerBulletinBoard.setEndDate(request.getEndDate());
        }
        if (request.getDepartment() != null) {
            centerBulletinBoard.setDepartment(request.getDepartment());
        }
        if (request.getCompletionLevel() != null) {
            centerBulletinBoard.setCompletionLevel(CenterBulletinBoard.CompletionLevel.valueOf(request.getCompletionLevel()));
        }
        if (request.getStatus() != null) {
            centerBulletinBoard.setStatus(CenterBulletinBoard.Status.valueOf(request.getStatus()));
        }

        centerBulletinBoardRepository.save(centerBulletinBoard);

        return centerBulletinBoardMapper.toResponse(centerBulletinBoard);
    }
}
