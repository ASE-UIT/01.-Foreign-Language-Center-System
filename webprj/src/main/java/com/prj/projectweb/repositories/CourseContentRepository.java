package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.CourseContent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseContentRepository extends JpaRepository<CourseContent, Long> {
    // Có thể thêm các phương thức truy vấn tùy chỉnh ở đây nếu cần
}
