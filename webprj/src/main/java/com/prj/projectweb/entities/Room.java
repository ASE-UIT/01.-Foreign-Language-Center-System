package com.prj.projectweb.entities;

import lombok.*;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {
    @Id
    private String roomName; 

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Course> courses = new HashSet<>(); 

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    @JsonBackReference
    Center center;

    // Phương thức tiện ích
    public void addCourse(Course course) {
        courses.add(course);
        course.setRoom(this);
    } 
    
    public void removeCourse(Course course) {
        courses.remove(course);
        course.setRoom(null);
    }
}
