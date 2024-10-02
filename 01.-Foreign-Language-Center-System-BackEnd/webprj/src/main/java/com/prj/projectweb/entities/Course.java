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

    @ElementCollection
    List<String> schedule;

    Integer likes;

    String image;
    Integer numberOfStudents;
    String object; // Đối tượng học viên

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giang_vien_id")
    @JsonBackReference
    GiangVien giangVien;

    // Phương thức tiện ích để quản lý mối quan hệ với CourseContent
    public void addCourseContent(CourseContent content) {
        courseContent.add(content);
        content.setCourse(this);
    }

    public void removeCourseContent(CourseContent content) {
        courseContent.remove(content);
        content.setCourse(null);
    }

    // Phương thức tiện ích để quản lý mối quan hệ với Certificate
    public void setCertificate(Certificate certificate) {
        this.certificate = certificate;
        if (certificate != null) {
            certificate.setCourse(this);
        }
    }
}
