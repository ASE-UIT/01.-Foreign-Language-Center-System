package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.GiangVien;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface GiangVienRepository extends JpaRepository<GiangVien, Long> {
    @Query("SELECT gv FROM GiangVien gv WHERE gv.user.center.id = :centerId")
    List<GiangVien> findByUserCenterId(@Param("centerId") Long centerId);
}
