package com.prj.projectweb.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Salary;
import com.prj.projectweb.entities.SalaryPayment;

@Repository
public interface SalaryPaymentRepository extends JpaRepository<SalaryPayment, Long> {
    List<SalaryPayment> findBySalaryId(Long salaryId);

    List<SalaryPayment> findBySalaryIn(List<Salary> salaries);

    @Query("SELECT SUM(sp.amountPaid) FROM SalaryPayment sp WHERE sp.salary.center.id = :centerId AND sp.isPaid = true")
    Double sumSalariesPaidByCenterId(@Param("centerId") Long centerId);
}
