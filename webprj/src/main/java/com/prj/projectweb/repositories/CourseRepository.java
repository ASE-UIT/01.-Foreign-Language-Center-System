package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCourseName(String course);
    @Query("SELECT c FROM Course c WHERE DATE(c.startTime) = :date")
    List<Course> findClassesByDate(@Param("date") LocalDate date);
}
