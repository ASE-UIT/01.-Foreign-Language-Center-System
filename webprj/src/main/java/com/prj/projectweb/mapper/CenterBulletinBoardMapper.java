package com.prj.projectweb.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.prj.projectweb.dto.request.CreateBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.CenterBulletinBoard;

@Mapper(componentModel = "spring") 
public interface CenterBulletinBoardMapper {
    @Mapping(target = "center", ignore = true)
    @Mapping(target = "completionLevel", constant = "NOT_DEFINED")
    @Mapping(target = "status", constant = "IN_PROGRESS")
    CenterBulletinBoard toEntity(CreateBulletinBoardRequest request);
    
    CenterBulletinBoardResponse toResponse(CenterBulletinBoard centerBulletinBoard);

    CenterBulletinBoard updateEntity(UpdateBulletinBoardRequest request, @MappingTarget CenterBulletinBoard centerBulletinBoard);
}
