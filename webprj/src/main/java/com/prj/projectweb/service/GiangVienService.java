package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.GiangVienMapper;
import com.prj.projectweb.repositories.GiangVienRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Transactional
    public List<String> addList(List<GiangVienDTO> requests) throws Exception {
        log.info("in add list courses service");

        List<String> names = new ArrayList<>();

        for (GiangVienDTO request : requests) {
            names.add(addGiangVien(request).getName());
        }

        return names;
    }

    @Transactional(readOnly = true)
    public GiangVienResponse getById(Long id) {
        return giangVienMapper.toGiangVienResponse(giangVienRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOTFOUND))) ;
    }

    @Transactional(readOnly = true)
    public List<GiangVienResponse> getList() {
        List<GiangVien> lists = giangVienRepository.findAll();

        return lists.stream()
                .map(giangVienMapper::toGiangVienResponse)
                .toList();
    }

    // Lấy tất cả TimeSlot của các khóa học mà giảng viên tham gia
    public Set<TimeSlot> getSchedulesOfGiangVien(Long giangVienId) throws Exception {
        GiangVien giangVien = giangVienRepository.findById(giangVienId)
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOTFOUND)) ;

        Set<TimeSlot> giangVienSchedules = new HashSet<>();

        for (Course course : giangVien.getCourses()) {
            giangVienSchedules.addAll(course.getSchedule());
        }

        return giangVienSchedules;
    }
}
