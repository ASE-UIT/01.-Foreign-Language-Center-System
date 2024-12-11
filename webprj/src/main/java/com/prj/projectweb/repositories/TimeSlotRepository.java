package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    boolean existsByDayAndTimeRange(String day, String timeRange);
    Optional<TimeSlot> findByDayAndTimeRange(String day, String timeRange);
}
