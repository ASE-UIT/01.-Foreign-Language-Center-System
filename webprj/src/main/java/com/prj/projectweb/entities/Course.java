package com.prj.projectweb.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @ManyToMany(cascade = {CascadeType.MERGE})
    @JoinTable(
            name = "course_time_slot",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "timeslot_id")
    )
    @JsonManagedReference
    @Builder.Default
    Set<TimeSlot> schedule = new HashSet<>();


    Integer likes;

    String image;
    Integer numberOfStudents;
    String object; // Đối tượng học viên

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "giang_vien_id")
    @JsonBackReference
    GiangVien giangVien;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<ChatMessage> chatMessages = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<FileBoard> fileBoards = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_name") 
    private Room room;

    // Phương thức tiện ích
    public void addCourseContent(CourseContent content) {
        courseContent.add(content);
        content.setCourse(this);
    }

    public void removeCourseContent(CourseContent content) {
        courseContent.remove(content);
        content.setCourse(null);
    }

    public void setCertificate(Certificate certificate) {
        this.certificate = certificate;
        if (certificate != null) {
            certificate.setCourse(this);
        }
    }

    public void addChatMessage(ChatMessage message) {
        chatMessages.add(message);
        message.setCourse(this);
    }
    public void removeChatMessage(ChatMessage message) {
        chatMessages.remove(message);
        message.setCourse(null);
    }

    public void addFileBoard(FileBoard fileBoard) {
        fileBoards.add(fileBoard);
        fileBoard.setCourse(this);
    }

    public void removeFileBoard(FileBoard fileBoard) {
        fileBoards.remove(fileBoard);
        fileBoard.setCourse(null);
    }
}
