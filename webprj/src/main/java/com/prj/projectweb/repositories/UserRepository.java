package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByEmail(String email);
    User findByEmail(String email);

    List<User> findAllByParentId(Long parentId);
}



