package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.service.GiangVienService;
import com.prj.projectweb.service.TimeSlotService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/timeslot")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TimeSlotController {
    TimeSlotService timeSlotService;


    @PostMapping("/add")
    public ApiResponse<TimeSlot> add(@RequestBody TimeSlotRequest timeSlotRequest) {
        return ApiResponse.<TimeSlot>builder()
                .message("add timeslot successfully")
                .result(timeSlotService.add(timeSlotRequest))
                .build();
    }
    @PostMapping("/addList")
    public ApiResponse<List<TimeSlot>> addList(@RequestBody List<TimeSlotRequest> timeSlotRequest) throws Exception {
        return ApiResponse.<List<TimeSlot>>builder()
                .message("add list timeslot successfully")
                .result(timeSlotService.addList(timeSlotRequest))
                .build();
    }
}
