package com.prj.projectweb.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String courseName;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<CourseContent> courseContent = new ArrayList<>();

    @Lob
    String objective;

    String duration;
    String tuitionFee;
    String learningMethod;

    @OneToOne(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    Certificate certificate;

    LocalDate startTime;
    LocalDate endTime;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<TimeSlot> schedules = new ArrayList<>();

    Integer likes;

    String image;
    Integer numberOfStudents;
    String object; // Đối tượng học viên

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giang_vien_id")
    @JsonBackReference
    GiangVien giangVien;

    // Phương thức tiện ích
    public void addCourseContent(CourseContent content) {
        courseContent.add(content);
        content.setCourse(this);
    }

    public void removeCourseContent(CourseContent content) {
        courseContent.remove(content);
        content.setCourse(null);
    }

    public void addTimeSlot(TimeSlot timeSlot) {
        schedules.add(timeSlot);
        timeSlot.setCourse(this);
    }

    public void removeTimeSlot(TimeSlot timeSlot) {
        schedules.remove(timeSlot);
        timeSlot.setCourse(null);
    }

    public void setCertificate(Certificate certificate) {
        this.certificate = certificate;
        if (certificate != null) {
            certificate.setCourse(this);
        }
    }
}
