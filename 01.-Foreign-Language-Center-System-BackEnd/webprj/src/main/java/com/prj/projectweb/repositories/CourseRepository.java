package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCourseName(String course);
    
    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.giangVien")
    List<Course> findAllWithGiangVien();
}
