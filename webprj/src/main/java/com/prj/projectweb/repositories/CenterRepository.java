package com.prj.projectweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Center;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long>{
    boolean existsByEmail(String email);
}
