package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findByCourseIdOrderByCreatedAtDesc(Long courseId);

    @Modifying
    @Query("DELETE FROM ChatMessage m WHERE m.createdAt < :cutoffTime")
    int deleteByTimestampBefore(LocalDateTime cutoffTime);
}