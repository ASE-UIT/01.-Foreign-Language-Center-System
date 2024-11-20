package com.prj.projectweb.dto.response;

import java.util.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CenterStatisticsResponse {
    String centerName;
    String totalExpenses; //tiền chi
    String totalRevenue; //tiền thu
    Long totalUsers;
    List<CourseStatisticsResponse> usersPerCourse;
    List<GiangVienWithVote> teacherStatistics;
}
