package com.prj.projectweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.vote.VoteGiangVien;
import com.prj.projectweb.entities.vote.VoteGiangVienId;
import com.prj.projectweb.enumType.VoteType;

import java.util.Optional;

@Repository
public interface VoteGiangVienRepository extends JpaRepository<VoteGiangVien, VoteGiangVienId> {
    Optional<VoteGiangVien> findById(VoteGiangVienId id);
    int countByGiangVienIdAndVoteType(Long giangVienId, VoteType voteType);
}
