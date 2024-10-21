package com.prj.projectweb.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
public class PaymentProof {

    // Getter và Setter cho các thuộc tính
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;
    private String fileType;
    private byte[] fileData;
    private String uploadedBy;
    private LocalDateTime uploadTime;
}
