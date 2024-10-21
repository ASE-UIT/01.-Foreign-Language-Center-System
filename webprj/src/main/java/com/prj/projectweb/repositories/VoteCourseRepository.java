package com.prj.projectweb.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.vote.VoteCourse;
import com.prj.projectweb.entities.vote.VoteCourseId;
import com.prj.projectweb.enumType.VoteType;

@Repository
public interface VoteCourseRepository extends JpaRepository<VoteCourse, VoteCourseId> {
    Optional<VoteCourse> findById(VoteCourseId id);

    int countByCourseIdAndVoteType(Long courseId, VoteType voteType);
}
