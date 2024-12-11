package com.prj.projectweb.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prj.projectweb.dto.request.CenterCreationRequest;
import com.prj.projectweb.dto.response.CenterResponse;
import com.prj.projectweb.dto.response.InfoCenterResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.CenterMapper;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.UserRepository;

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
    UserRepository userRepository;

    @Transactional
    public CenterResponse createCenter(CenterCreationRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        if (!"ChuCongTy".equals(user.getRole().getRoleName())) {
            throw new AppException(ErrorCode.UNAUTHORIZED_ACTION);
        }

        if (centerRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }
    
        Center center = Center.builder()
        .name(request.getName())
        .address(request.getAddress()) // Số nhà, tên đường
        .ward(request.getWard())       // Phường/xã
        .district(request.getDistrict()) // Quận/huyện
        .city(request.getCity())       // Tỉnh/thành phố
        .email(request.getEmail())
        .build();

    
        Center savedCenter = centerRepository.save(center);
        return centerMapper.toResponse(savedCenter);
    }
    

    @Transactional(readOnly = true)
    public InfoCenterResponse getInfoCenterById(Long id) {
        log.info("SERVICE: get info center by id");
        Center center = centerRepository.findById(id)
        .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        String fullAddress = String.format("%s, %s, %s, %s", 
                                            center.getAddress(), 
                                            center.getWard(), 
                                            center.getDistrict(), 
                                            center.getCity()
                                            );
        return InfoCenterResponse.builder()
                        .id(id)
                        .name(center.getName())
                        .address(fullAddress)
                        .email(center.getEmail())
                        .build();
    }
}
