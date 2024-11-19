package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.GiangVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiangVienRepository extends JpaRepository<GiangVien, Long> {
}
