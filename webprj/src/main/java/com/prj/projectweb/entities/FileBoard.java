package com.prj.projectweb.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String filename;
    String filePath;
    String downloadLink;
    boolean isPublic;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    @JsonBackReference
    Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giang_vien_id")
    @JsonBackReference
    GiangVien giangVien;

    LocalDateTime createdAt;
}