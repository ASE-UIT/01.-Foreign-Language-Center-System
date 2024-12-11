package com.prj.projectweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.CenterBulletinBoard;

@Repository
public interface CenterBulletinBoardRepository extends JpaRepository<CenterBulletinBoard, Long> {

}
