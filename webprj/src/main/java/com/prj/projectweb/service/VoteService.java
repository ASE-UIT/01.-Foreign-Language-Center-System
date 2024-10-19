package com.prj.projectweb.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prj.projectweb.dto.request.VoteCourseRequest;
import com.prj.projectweb.dto.request.VoteGiangVienRequest;
import com.prj.projectweb.dto.response.VoteInfoResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.entities.vote.VoteCourse;
import com.prj.projectweb.entities.vote.VoteCourseId;
import com.prj.projectweb.entities.vote.VoteGiangVien;
import com.prj.projectweb.entities.vote.VoteGiangVienId;
import com.prj.projectweb.enumType.VoteType;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.GiangVienRepository;
import com.prj.projectweb.repositories.UserRepository;
import com.prj.projectweb.repositories.VoteCourseRepository;
import com.prj.projectweb.repositories.VoteGiangVienRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VoteService {
    VoteGiangVienRepository voteGiangVienRepository;
    UserRepository userRepository;
    GiangVienRepository giangVienRepository;
    VoteCourseRepository voteCourseRepository;
    CourseRepository courseRepository;

    @Transactional
    public boolean voteForGiangVien(VoteGiangVienRequest request) {
        
        User student = userRepository.findById(request.getStudentId())
                                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        if (!student.getRole().getRoleName().equalsIgnoreCase("HocVien")) {
            log.info("LOG: " + student.getRole().getRoleName());
            return false;
        }

        GiangVien giangVien = giangVienRepository.findById(request.getGiangVienId())
                                    .orElseThrow( () -> new AppException(ErrorCode.TEACHER_NOTFOUND));

        VoteGiangVienId voteId = VoteGiangVienId.builder().studentId(request.getStudentId()).giangVienId(request.getGiangVienId()).build();

        VoteType voteType = null;
        try {
            voteType = VoteType.fromValue(request.getVote());  // Ánh xạ int vote vào enum voteType
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_VOTE);  
        }


        VoteGiangVien existingVote = voteGiangVienRepository.findById(voteId).orElse(null);

        // Update vote
        if (existingVote != null) {
            existingVote.setVoteType(voteType);
            voteGiangVienRepository.save(existingVote);
        } else {
            // Create new vote
            voteGiangVienRepository.save(VoteGiangVien.builder()
                                        .id(voteId)
                                        .student(student)
                                        .giangVien(giangVien)
                                        .voteType(voteType)
                                        .build());
        }

        return true;
    }

    @Transactional
    public boolean voteForCourse(VoteCourseRequest request) {
        User student = userRepository.findById(request.getStudentId())
                                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        if (!student.getRole().getRoleName().equalsIgnoreCase("HocVien")) {
            log.info("LOG: " + student.getRole().getRoleName());
            return false;
        }

        Course course = courseRepository.findById(request.getCourseId())
                                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));
        
        VoteType voteType = null;
        try {
            voteType = VoteType.fromValue(request.getVote());
        } catch (Exception e){
            throw new AppException(ErrorCode.INVALID_VOTE);  
        }

        VoteCourseId id = VoteCourseId.builder().courseId(request.getCourseId()).studentId(request.getStudentId()).build();

        VoteCourse existingVote = voteCourseRepository.findById(id).orElse(null);

        //Update vote
        if (existingVote != null) {
            existingVote.setVoteType(voteType);
            voteCourseRepository.save(existingVote);
        } else {
            // Create new vote
            voteCourseRepository.save(VoteCourse.builder()
                                        .id(id)
                                        .student(student)
                                        .course(course)
                                        .voteType(voteType)
                                        .build());
        }


        return true;
    }

    @Transactional
    public List<VoteInfoResponse> getListGiangVien() {
        List<GiangVien> giangVienList = giangVienRepository.findAll();
        List<VoteInfoResponse> voteResponses = new ArrayList<>();

        for (GiangVien gv: giangVienList) {
            int neutralVote = voteGiangVienRepository.countByGiangVienIdAndVoteType(gv.getId(), VoteType.NEUTRAL);
            int likeVote = voteGiangVienRepository.countByGiangVienIdAndVoteType(gv.getId(), VoteType.LIKE);
            int dislikeVote = voteGiangVienRepository.countByGiangVienIdAndVoteType(gv.getId(), VoteType.DISLIKE);

            voteResponses.add(VoteInfoResponse.builder()
                                            .id(gv.getId())
                                            .name(gv.getName())
                                            .neutral(neutralVote)
                                            .like(likeVote)
                                            .dislike(dislikeVote)
                                            .build());
        }

        return voteResponses;
    }

    @Transactional
    public List<VoteInfoResponse> getListCourse() {
        List<Course> courseList = courseRepository.findAll();
        List<VoteInfoResponse> voteResponses = new ArrayList<>();

        for (Course course: courseList) {
            int neutralVote = voteGiangVienRepository.countByGiangVienIdAndVoteType(course.getId(), VoteType.NEUTRAL);
            int likeVote = voteGiangVienRepository.countByGiangVienIdAndVoteType(course.getId(), VoteType.LIKE);
            int dislikeVote = voteGiangVienRepository.countByGiangVienIdAndVoteType(course.getId(), VoteType.DISLIKE);

            voteResponses.add(VoteInfoResponse.builder()
                                            .id(course.getId())
                                            .name(course.getCourseName())
                                            .neutral(neutralVote)
                                            .like(likeVote)
                                            .dislike(dislikeVote)
                                            .build());
        }

        return voteResponses;
    }
}
