package com.prj.projectweb.repositories;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {
    List<Room> findByCenter(Center center);
    List<Room> findByCenter_Id(Long centerId);
}
