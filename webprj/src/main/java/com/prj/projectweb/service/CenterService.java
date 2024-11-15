package com.prj.projectweb.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prj.projectweb.dto.request.CenterCreationRequest;
import com.prj.projectweb.dto.response.CenterResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.CenterMapper;
import com.prj.projectweb.repositories.CenterRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CenterService {
    CenterRepository centerRepository;
    CenterMapper centerMapper;

    @Transactional
    public CenterResponse createCenter(CenterCreationRequest request) {
        if (centerRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
    
        Center center = Center.builder()
                .name(request.getName())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail())
                .managerName(request.getManagerName())
                .build();
    
        Center savedCenter = centerRepository.save(center);
        return centerMapper.toResponse(savedCenter);
    }
    

}
