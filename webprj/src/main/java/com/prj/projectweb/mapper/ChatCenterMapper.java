package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.ChatCenterRequest;
import com.prj.projectweb.dto.response.ChatCenterResponse;
import com.prj.projectweb.entities.ChatCenter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ChatCenterMapper {

    @Mapping(target = "senderId", source = "sender.userId")
    @Mapping(target = "receiverId", source = "receiver.userId")
    ChatCenterResponse toDto(ChatCenter chatCenter);

    @Mapping(target = "sender.userId", source = "senderId")
    @Mapping(target = "receiver.userId", source = "receiverId")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())") // Automatically set createdAt
    ChatCenter toEntity(ChatCenterRequest chatCenterRequest);
}
