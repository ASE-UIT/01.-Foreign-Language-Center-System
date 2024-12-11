package com.prj.projectweb.service;

import org.springframework.stereotype.Service;

import com.prj.projectweb.dto.request.AvailableRoomRequest;
import com.prj.projectweb.dto.request.RoleRequest;
import com.prj.projectweb.dto.request.RoomRequest;
import com.prj.projectweb.dto.response.RoleResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.Room;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.TimeSlotMapper;
import com.prj.projectweb.repositories.CenterRepository;
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
    CenterRepository centerRepository;

    @Transactional
    public RoomRequest addRoom(RoomRequest request) {
        // Kiểm tra room đã tồn tại hay chưa
        if (roomRepository.existsById(request.getRoomName())) {
            throw new AppException(ErrorCode.ROOM_EXISTED);
        }

        // Tìm kiếm center theo ID
        Center center = centerRepository.findById(request.getCenterId())
                .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        // Tạo mới Room và gán Center
        Room room = Room.builder()
                .roomName(request.getRoomName())
                .center(center)
                .build();

        // Lưu Room
        roomRepository.save(room);

        return request;
    }

    @Transactional
    public List<String> addList(List<RoomRequest> requests) {
        List<String> responses = new ArrayList<>();

        for (RoomRequest request : requests) {
            try {
                addRoom(request); // Gọi phương thức addRoom
                responses.add(request.getRoomName());
            } catch (AppException e) {
                // Xử lý ngoại lệ (nếu cần, có thể thêm log)
                responses.add("Failed to add room: " + request.getRoomName());
            }
        }

        return responses;
    }

    @Transactional
    public List<RoomRequest> getAll() {
        return roomRepository.findAll()
                .stream()
                .map(room -> RoomRequest.builder()
                            .roomName(room.getRoomName())
                            .centerId(room.getCenter().getId())
                            .build())
                .toList();    
    }

    @Transactional
    public List<String> getRoomNamesByCenterId(Long centerId) {
        // Tìm center theo ID
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));
    
        // Lấy danh sách tên phòng thuộc center
        return roomRepository.findByCenter(center)
                .stream()
                .map(Room::getRoomName)
                .toList();
    }
    

    @Transactional
    public List<Room> getAvailableRooms(AvailableRoomRequest request) {
        // Lấy danh sách phòng thuộc centerId
        List<Room> roomsByCenter = roomRepository.findByCenter_Id(request.getCenterId());
        List<Room> availableRoomNames = new ArrayList<>();
    
        // Chuyển đổi Set<TimeSlotRequest> sang Set<TimeSlot>
        Set<TimeSlot> timeSlots = request.getTimeSlots().stream()
                .map(timeSlotMapper::toTimeSlot) // Sử dụng TimeSlotMapper để chuyển đổi
                .collect(Collectors.toSet());
    
        for (Room room : roomsByCenter) {
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
                availableRoomNames.add(room);
            }
        }
    
        return availableRoomNames;
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
