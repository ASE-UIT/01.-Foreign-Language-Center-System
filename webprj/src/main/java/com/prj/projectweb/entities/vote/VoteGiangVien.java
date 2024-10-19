package com.prj.projectweb.entities.vote;

import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.enumType.VoteType;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VoteGiangVien {
    @EmbeddedId
    VoteGiangVienId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("studentId")
    @JoinColumn(name = "student_id")
    User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("giangVienId")
    @JoinColumn(name = "giang_vien_id")
    GiangVien giangVien;

    @Enumerated(EnumType.STRING)
    VoteType voteType;
}
