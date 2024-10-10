package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    List<CourseRegistration> findByStudent_UserId(Long userId); // Tìm kiếm theo userId của học viên
}