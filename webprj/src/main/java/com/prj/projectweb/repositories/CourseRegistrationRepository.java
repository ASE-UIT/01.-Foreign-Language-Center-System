package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRegistrationRepository extends JpaRepository<CourseRegistration, Long> {
    List<CourseRegistration> findByStudent_UserId(Long userId); // Tìm kiếm theo userId của học viên
    List<CourseRegistration> findByCourse_IdAndHasPaid(Long courseId, boolean hasPaid);
    boolean existsByStudentAndCourse(User student, Course course);

}
