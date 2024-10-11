package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.FileBoard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileBoardRepository extends JpaRepository<FileBoard, Long> {
}