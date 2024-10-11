package com.prj.projectweb.service;

import org.springframework.stereotype.Service;

import com.prj.projectweb.dto.request.AvailableRoomRequest;
import com.prj.projectweb.dto.request.RoleRequest;
import com.prj.projectweb.dto.request.RoomRequest;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.Room;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.TimeSlotMapper;
import com.prj.projectweb.repositories.RoomRepository;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import java.util.*;
import java.util.stream.Collectors;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class RoomService {
    RoomRepository roomRepository;
    TimeSlotMapper timeSlotMapper;

    @Transactional
    public RoomRequest addRoom(RoomRequest request) {
        if (roomRepository.existsById(request.getRoomName())) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }

        roomRepository.save(Room.builder()
                                .roomName(request.getRoomName())
                                .build());
        
        return request;

    }

    @Transactional
    public List<String> addList(List<RoomRequest> requests) {
        List<String> responses = new ArrayList<>();

        for (RoomRequest request : requests) {
            addRoom(request);
            responses.add(request.getRoomName());
        }

        return responses;
    }

    @Transactional
    public List<String> getAll() {
        return roomRepository.findAll()
                .stream()
                .map(Room::getRoomName)
                .toList();
    }

    @Transactional
    public List<Room> getAvailableRooms(AvailableRoomRequest request) {
        List<Room> allRooms = roomRepository.findAll();
        List<Room> availableRooms = new ArrayList<>();

        // Chuyển đổi Set<TimeSlotRequest> sang Set<TimeSlot>
        Set<TimeSlot> timeSlots = request.getTimeSlots().stream()
                .map(timeSlotMapper::toTimeSlot) // Sử dụng TimeSlotMapper để chuyển đổi
                .collect(Collectors.toSet());

        for (Room room : allRooms) {
            boolean isAvailable = true;

            // Kiểm tra từng lớp học trong phòng
            for (Course course : room.getCourses()) {
                // Kiểm tra trùng ngày và khung giờ
                if (isScheduleConflict(course.getSchedule(), timeSlots) &&
                    !(course.getEndTime().isBefore(request.getStartDate()) || 
                    course.getStartTime().isAfter(request.getEndDate()))) {
                    isAvailable = false;
                    break;
                }
            }

            if (isAvailable) {
                availableRooms.add(room);
            }
        }

        return availableRooms;
    }



    private boolean isScheduleConflict(Set<TimeSlot> roomSchedule, Set<TimeSlot> requiredSchedule) {
        for (TimeSlot roomSlot : roomSchedule) {
            for (TimeSlot requiredSlot : requiredSchedule) {
                if (roomSlot.getDay().equals(requiredSlot.getDay()) &&
                    roomSlot.getTimeRange().equals(requiredSlot.getTimeRange())) {
                    return true;
                }
            }
        }
        return false;
    }
}
