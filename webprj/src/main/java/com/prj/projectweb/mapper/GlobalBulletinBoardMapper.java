package com.prj.projectweb.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.prj.projectweb.dto.request.CreateGlobalBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.entities.CenterBulletinBoard;
import com.prj.projectweb.entities.GlobalBulletinBoard;



@Mapper(componentModel = "spring") 
public interface GlobalBulletinBoardMapper {
    @Mapping(target = "completionLevel", constant = "NOT_DEFINED")
    @Mapping(target = "status", constant = "IN_PROGRESS")
    GlobalBulletinBoard toEntity(CreateGlobalBulletinBoardRequest request);

    CenterBulletinBoardResponse toResponse(GlobalBulletinBoard globalBulletinBoard);

    GlobalBulletinBoard updateEntity(UpdateBulletinBoardRequest request, @MappingTarget GlobalBulletinBoard globalBulletinBoard);
}
