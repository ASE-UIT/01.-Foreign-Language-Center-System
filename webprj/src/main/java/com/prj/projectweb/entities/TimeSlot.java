package com.prj.projectweb.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String day; // e.g., Mon, Fri, Sat
    String timeRange; // e.g., "7h - 9h"

    @ManyToMany(mappedBy = "schedule")
    @JsonBackReference
    List<Course> courses = new ArrayList<>();
}
