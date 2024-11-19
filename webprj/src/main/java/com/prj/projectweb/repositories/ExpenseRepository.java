package com.prj.projectweb.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Expense;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByCenterId(Long centerId);

    @Query("SELECT e FROM Expense e WHERE e.center.id = :centerId AND MONTH(e.paymentDate) = :month AND YEAR(e.paymentDate) = :year")
    List<Expense> findByCenterIdAndPaymentDateMonthAndYear(@Param("centerId") Long centerId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT e FROM Expense e WHERE e.center.id = :centerId AND YEAR(e.paymentDate) = :year")
    List<Expense> findByCenterIdAndPaymentDateYear(@Param("centerId") Long centerId, @Param("year") int year);
}
