package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.mapper.GiangVienMapper;
import com.prj.projectweb.repositories.GiangVienRepository;
import java.util.List;
import java.util.stream.Collectors;
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

    public List<GiangVienResponse> getAllGiangVien() {
        log.info("Fetching all GiangVien");
        List<GiangVien> giangViens = giangVienRepository.findAll();
        return giangViens.stream()
                .map(giangVienMapper::toGiangVienResponse)
                .collect(Collectors.toList());
    }

    public GiangVienResponse addGiangVienToCourse(Long giangVienId, Course course) {
        GiangVien giangVien = giangVienRepository.findById(giangVienId)
            .orElseThrow(() -> new RuntimeException("GiangVien not found with id: " + giangVienId));
        
        giangVien.addCourse(course);
        giangVienRepository.save(giangVien);
        return giangVienMapper.toGiangVienResponse(giangVien);
    }
}
