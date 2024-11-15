package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.ChatCenter;
import com.prj.projectweb.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface ChatCenterRepository extends JpaRepository<ChatCenter, Long> {
    List<ChatCenter> findBySender_UserId(Long userId); // Query by sender's userId
    List<ChatCenter> findByReceiver_UserId(Long userId); // Query by receiver's userId
    List<ChatCenter> findByReceiver_UserIdAndCenter_Id(Long userId, Long centerId);
}
