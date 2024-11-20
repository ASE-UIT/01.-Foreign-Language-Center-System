package com.prj.projectweb.service;

import org.springframework.stereotype.Service;

import com.prj.projectweb.dto.request.CreateBulletinBoardRequest;
import com.prj.projectweb.dto.request.CreateGlobalBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.CenterBulletinBoard;
import com.prj.projectweb.entities.GlobalBulletinBoard;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.exception.ResourceNotFoundException;
import com.prj.projectweb.mapper.GlobalBulletinBoardMapper;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.GlobalBulletinBoardRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GlobalBulletinBoardService {
    GlobalBulletinBoardRepository globalBulletinBoardRepository;
    GlobalBulletinBoardMapper globalBulletinBoardMapper;

    public CenterBulletinBoardResponse create(CreateGlobalBulletinBoardRequest request) {
        // Kiểm tra quyền truy cập: User vai trò là BanDieuHanhHeThong hoặc ChuCongTy
        

        // Tạo bảng tin từ DTO
        GlobalBulletinBoard globalBulletinBoard = globalBulletinBoardMapper.toEntity(request);
        
        globalBulletinBoardRepository.save(globalBulletinBoard);
        
        return globalBulletinBoardMapper.toResponse(globalBulletinBoard);
    }

    public CenterBulletinBoardResponse update(Long id, UpdateBulletinBoardRequest request) {
        // Kiểm tra quyền truy cập: User vai trò là BanDieuHanhHeThong hoặc ChuCongTy
        

        // Tạo bảng tin từ DTO
        GlobalBulletinBoard globalBulletinBoard = globalBulletinBoardRepository.findById(id)
                                    .orElseThrow(() -> new AppException(ErrorCode.CENTER_BULLETIN_BOARD_NOTFOUND));
        
        if (globalBulletinBoard.getStatus() == GlobalBulletinBoard.Status.COMPLETED) {
            throw new IllegalArgumentException("Cannot edit a completed bulletin board.");
        }

        // Kiểm tra và cập nhật các trường từ request nếu có
        if (request.getName() != null) {
            globalBulletinBoard.setName(request.getName());
        }
        if (request.getContent() != null) {
            globalBulletinBoard.setContent(request.getContent());
        }
        if (request.getStartDate() != null) {
            globalBulletinBoard.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            globalBulletinBoard.setEndDate(request.getEndDate());
        }
        if (request.getDepartment() != null) {
            globalBulletinBoard.setDepartment(request.getDepartment());
        }
        if (request.getCompletionLevel() != null) {
            globalBulletinBoard.setCompletionLevel(GlobalBulletinBoard.CompletionLevel.valueOf(request.getCompletionLevel()));
        }
        if (request.getStatus() != null) {
            globalBulletinBoard.setStatus(GlobalBulletinBoard.Status.valueOf(request.getStatus()));
        }
        
        globalBulletinBoardRepository.save(globalBulletinBoard);
        
        return globalBulletinBoardMapper.toResponse(globalBulletinBoard);
    }
}
