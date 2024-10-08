package com.prj.projectweb.entities;

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
@Table(name = "GIANGVIEN")
public class GiangVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    LocalDate dob;
    Integer likes;
    Integer dislikes;

    // Mối quan hệ OneToMany với Course
    @OneToMany(mappedBy = "giangVien", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<Course> courses = new ArrayList<>();

    // Mối quan hệ OneToMany với Files
    @OneToMany(mappedBy = "giangVien", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<FileBoard> fileBoards = new ArrayList<>();


    // Phương thức tiện ích 
    public void addCourse(Course course) {
        courses.add(course);
        course.setGiangVien(this);
    }

    public void removeCourse(Course course) {
        courses.remove(course);
        course.setGiangVien(null);
    }

    public void addFileBoard(FileBoard fileBoard) {
        fileBoards.add(fileBoard);
        fileBoard.setGiangVien(this);
    }

    public void removeFileBoard(FileBoard fileBoard) {
        fileBoards.remove(fileBoard);
        fileBoard.setGiangVien(null);
    }
}
