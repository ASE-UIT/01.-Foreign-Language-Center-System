package com.prj.projectweb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class CourseResponse {
    String courseName;          // Tên khóa học
    String objective;           // Giới thiệu mục đích
    String duration;            // Thời lượng
    String tuitionFee;          // Học phí
    LocalDate startTime;        // Ngày bắt đầu
    String object;              // Đối tượng học sinh
    String image;               // Link hình ảnh minh họa
    String nameOfGiangVien;     // Tên giảng viên
    Integer numberOfStudents;   // Số lượng học sinh
    Integer likes;              // Số lượt likes
    Long centerId;
}