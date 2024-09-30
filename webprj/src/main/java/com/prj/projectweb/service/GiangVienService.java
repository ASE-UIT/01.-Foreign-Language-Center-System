package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.mapper.GiangVienMapper;
import com.prj.projectweb.repositories.GiangVienRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class GiangVienService {
    GiangVienRepository giangVienRepository;
    GiangVienMapper giangVienMapper;

    public GiangVienResponse addGiangVien(GiangVienDTO giangVienDTO) {
        log.info("service add gia");
        GiangVien giangVien = giangVienMapper.dtoToGiangVien(giangVienDTO);

        giangVienRepository.save(giangVien);

        return giangVienMapper.toGiangVienResponse(giangVien);
    }
}
