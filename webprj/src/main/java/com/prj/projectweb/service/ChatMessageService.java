package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.ChatMessageRequest;
import com.prj.projectweb.dto.response.ChatMessageResponse;
import com.prj.projectweb.entities.ChatMessage;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.repositories.ChatMessageRepository;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatMessageService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public ChatMessageResponse saveMessage(ChatMessageRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        ChatMessage message = new ChatMessage();
        message.setMessage(request.getMessage().trim());
        message.setCourse(course);
        message.setUser(user);

        ChatMessage savedMessage = chatMessageRepository.save(message);
        return convertToResponse(savedMessage);
    }

    private ChatMessageResponse convertToResponse(ChatMessage message) {
        ChatMessageResponse dto = new ChatMessageResponse();
        dto.setMessage(message.getMessage());
        dto.setUsername(message.getUser().getUsername());
        dto.setUserId(message.getUser().getUserId());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        String formattedDate = message.getCreatedAt().format(formatter);
        dto.setCreatedAt(formattedDate);
        return dto;
    }

    public List<ChatMessageResponse> getMessagesByCourseId(Long courseId) {
        List<ChatMessage> messages = chatMessageRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
        return messages.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
}
