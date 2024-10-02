package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    boolean existsByDayAndTimeRange(String day, String timeRange);
}
