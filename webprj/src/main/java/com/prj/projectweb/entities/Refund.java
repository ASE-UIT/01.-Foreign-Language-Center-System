package com.prj.projectweb.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
public class Refund {
    // Getter và Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentEmail;
    private String courseName;
    private String reason;
    private double refundAmount;

    // Constructor, Getter và Setter
    public Refund() {}

    public Refund(String studentEmail, String courseName, String reason, double refundAmount) {
        this.studentEmail = studentEmail;
        this.courseName = courseName;
        this.reason = reason;
        this.refundAmount = refundAmount;
    }
}
