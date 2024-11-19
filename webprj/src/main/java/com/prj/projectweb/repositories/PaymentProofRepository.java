package com.prj.projectweb.repositories;

import com.prj.projectweb.entities.PaymentProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentProofRepository extends JpaRepository<PaymentProof, Long> {
}
