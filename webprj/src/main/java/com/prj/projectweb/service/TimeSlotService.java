package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.TimeSlotMapper;
import com.prj.projectweb.repositories.TimeSlotRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TimeSlotService {
    TimeSlotRepository timeSlotRepository;
    TimeSlotMapper timeSlotMapper;

    @Transactional
    public TimeSlot add(TimeSlotRequest request) {
        log.info("in service add a timeslot");

        if (timeSlotRepository.existsByDayAndTimeRange(request.getDay(), request.getTimeRange())) {
            throw new AppException(ErrorCode.TIMESLOT_EXISTED);
        }

        // Chuyển đổi TimeSlotRequest sang TimeSlot entity
        TimeSlot timeSlot = timeSlotMapper.toTimeSlot(request);

        timeSlotRepository.save(timeSlot);

        // Chuyển đổi lại TimeSlot entity thành TimeSlotRequest để trả về
        return timeSlot;
    }

    @Transactional
    public List<TimeSlot> addList(List<TimeSlotRequest> requests) throws Exception {
        log.info("in service add list timeslot");

        List<TimeSlot> lists = new ArrayList<>();

        for (TimeSlotRequest request : requests) {
            lists.add(add(request));
        }

        return lists;
    }

    @Transactional(readOnly = true)
    public List<TimeSlot> getList() {
        log.info("in get list timeslot service");

        List<TimeSlot> responses = timeSlotRepository.findAll();

        return responses;
    }

    @Transactional(readOnly = true)
    public TimeSlot getById(Long id) throws Exception {
        log.info("in get timeslot by id service");

        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.TIMESLOT_NOTFOUND));
    }
}
