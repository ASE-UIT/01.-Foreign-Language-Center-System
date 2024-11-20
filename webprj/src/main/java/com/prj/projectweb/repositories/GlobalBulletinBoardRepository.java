package com.prj.projectweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.GlobalBulletinBoard;

@Repository
public interface GlobalBulletinBoardRepository extends JpaRepository<GlobalBulletinBoard, Long>{

    
}
