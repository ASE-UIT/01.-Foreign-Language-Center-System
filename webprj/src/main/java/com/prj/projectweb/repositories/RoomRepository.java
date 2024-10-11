package com.prj.projectweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Room;

@Repository
public interface RoomRepository extends JpaRepository<Room, String> {

}
