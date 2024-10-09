package com.prj.projectweb.service;

import com.prj.projectweb.repositories.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
public class MessageCleanupService {

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void deleteOldMessages() {
        LocalDateTime cutoffTime = LocalDateTime.of(LocalDate.now().minusDays(1), LocalTime.MAX);
        int deletedCount = chatMessageRepository.deleteByTimestampBefore(cutoffTime);
        System.out.println("Deleted " + deletedCount + " old messages");
    }
}
