package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);

    List<User> findAllByParentId(Long parentId);

    @Query("SELECT COUNT(u) FROM User u WHERE u.center.id = :centerId AND u.role.roleName = 'HocVien'")
    long countByRoleHocVienAndCenterId(@Param("centerId") Long centerId);
}



