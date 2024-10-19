package com.prj.projectweb.entities.vote;

import java.io.Serializable;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class VoteGiangVienId implements Serializable {
    private Long studentId;
    private Long giangVienId;
}
