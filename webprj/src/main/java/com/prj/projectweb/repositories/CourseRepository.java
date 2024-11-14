package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCourseName(String course);
    // Phương thức tìm lớp học theo ngày
    @Query("SELECT c FROM Course c WHERE DATE(c.startTime) = :date")
    List<Course> findClassesByDate(@Param("date") LocalDate date);
    List<Course> findByIsDeletedFalse();
}
