package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, String> {
}