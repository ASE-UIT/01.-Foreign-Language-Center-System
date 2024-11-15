package com.prj.projectweb.entities;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class Center {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;
    String address;
    String phone;
    String email;
    String managerName;

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<User> users = new ArrayList<>();

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<Course> courses = new ArrayList<>();

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<ChatCenter> chatCenter = new ArrayList<>();

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<FileBoard> fileBoards = new ArrayList<>();

    @OneToMany(mappedBy = "center", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    List<Room> rooms = new ArrayList<>();
}
