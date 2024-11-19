package com.prj.projectweb.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.prj.projectweb.entities.Salary;

@Repository
public interface SalaryRepository extends JpaRepository<Salary, Long>{

}
