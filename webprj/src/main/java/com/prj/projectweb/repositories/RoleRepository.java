package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    boolean existsByRoleName(String name);
    Role findByRoleName(String name);
}
