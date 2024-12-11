package com.prj.projectweb.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.request.AvailableRoomRequest;
import com.prj.projectweb.dto.request.RoomRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.entities.Room;
import com.prj.projectweb.service.RoomService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.util.*;

@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoomController {

    RoomService roomService;

    @GetMapping
    public ApiResponse<List<RoomRequest>> getAll() {
        return ApiResponse.<List<RoomRequest>>builder()
                .result(roomService.getAll())
                .build();
    }
    
    @PostMapping
    public ApiResponse<RoomRequest> add(@RequestBody RoomRequest room) {
        return ApiResponse.<RoomRequest>builder()
                .message("add 1 room succesfully")
                .result(roomService.addRoom(room))
                .build();
    }

    @GetMapping("/center/{centerId}")
    public ApiResponse<List<String>> getRoomNamesByCenterId(@PathVariable Long centerId) {
        return ApiResponse.<List<String>>builder()
                .result(roomService.getRoomNamesByCenterId(centerId))
                .build();
    }
    


    @PostMapping("/addList")
    public ApiResponse<List<String>> addList(@RequestBody List<RoomRequest> requests) {
        List<String> response = roomService.addList(requests);
        return ApiResponse.<List<String>>builder()
                .message("add " + requests.size() + " room successfully")
                .result(response)
                .build();
    }

    @PostMapping("/availableRooms")
    public ApiResponse<List<Room>> getAvailableRooms(@RequestBody AvailableRoomRequest request) {
        List<Room> availableRooms = roomService.getAvailableRooms(request);
        return ApiResponse.<List<Room>>builder()
                .message("Available rooms retrieved successfully")
                .result(availableRooms)
                .build();
    }
}
