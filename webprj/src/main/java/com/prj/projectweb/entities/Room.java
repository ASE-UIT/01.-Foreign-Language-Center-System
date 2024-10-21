package com.prj.projectweb.entities;

import lombok.*;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

import java.util.HashSet;
import java.util.Set;

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
