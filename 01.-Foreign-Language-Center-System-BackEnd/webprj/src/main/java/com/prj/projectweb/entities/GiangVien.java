package com.prj.projectweb.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

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
    private Long id;

    String name;
    LocalDate dob;
    Integer likes;
    Integer dislikes;

    // Mối quan hệ OneToMany với Course
    @OneToMany(mappedBy = "giangVien", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @Builder.Default
    List<Course> courses = new ArrayList<>();

    // Phương thức tiện ích để quản lý mối quan hệ
    public void addCourse(Course course) {
        courses.add(course);
        course.setGiangVien(this);
    }

    public void removeCourse(Course course) {
        courses.remove(course);
        course.setGiangVien(null);
    }

    public Schedule getSchedule() {
        Schedule schedule = new Schedule();
        for (Course course : this.courses) {
            schedule.addTimeSlot(course.getStartTime(), course.getEndTime());
        }
        return schedule;
    }

    private static class Schedule {
        private List<TimeSlot> timeSlots = new ArrayList<>();

        public void addTimeSlot(LocalDate start, LocalDate end) {
            timeSlots.add(new TimeSlot(start, end));
        }

        public boolean overlaps(Schedule other) {
            for (TimeSlot thisSlot : this.timeSlots) {
                for (TimeSlot otherSlot : other.timeSlots) {
                    if (thisSlot.overlaps(otherSlot)) {
                        return true;
                    }
                }
            }
            return false;
        }

        private static class TimeSlot {
            private LocalDate start;
            private LocalDate end;

            public TimeSlot(LocalDate start, LocalDate end) {
                this.start = start;
                this.end = end;
            }

            public boolean overlaps(TimeSlot other) {
                return this.start.isBefore(other.end) && other.start.isBefore(this.end);
            }
        }
    }

    public boolean hasConflictingSchedule(GiangVien other) {
        // Check if this GiangVien has any courses
        if (this.courses.isEmpty() || other.courses.isEmpty()) {
            return false; // No conflict if either GiangVien has no courses
        }

        // Compare the schedules of all courses
        for (Course thisCourse : this.courses) {
            for (Course otherCourse : other.courses) {
                if (thisCourse.getStartTime().isBefore(otherCourse.getEndTime()) &&
                    otherCourse.getStartTime().isBefore(thisCourse.getEndTime())) {
                    return true; // There is a conflict
                }
            }
        }

        // If no conflicts found, return the result of the existing check
        return this.getSchedule().overlaps(other.getSchedule());
    }
}
