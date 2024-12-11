package com.prj.projectweb.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Salary;
import com.prj.projectweb.entities.User;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long>{
    @Query("SELECT s FROM Salary s WHERE s.user = :user AND s.year = :year ORDER BY s.id ASC")
    List<Salary>  findByUserAndYear(@Param("user") User user, @Param("year") Integer year);

}
