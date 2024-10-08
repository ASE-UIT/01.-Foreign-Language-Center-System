package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.CourseRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    List<CourseRegistration> findByStudentId(Long studentId);
}
