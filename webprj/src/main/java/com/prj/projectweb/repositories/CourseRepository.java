package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.enumType.RegistrationStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.*;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    boolean existsByCourseNameAndCenter_Id(String courseName, Long centerId);

    // Phương thức tìm lớp học theo ngày
    @Query("SELECT c FROM Course c WHERE DATE(c.startTime) = :date")
    List<Course> findClassesByDate(@Param("date") LocalDate date);
    
    List<Course> findByIsDeletedFalse();

    List<Course> findByCenter(Center center);

    @Query("SELECT c FROM Course c WHERE c.center.id = :centerId")
    List<Course> findByCenterId(@Param("centerId") Long centerId);


}
