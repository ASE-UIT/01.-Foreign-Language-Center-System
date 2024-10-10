package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.response.FileBoardResponse;
import com.prj.projectweb.dto.request.FileBoardUploadRequest;
import com.prj.projectweb.entities.FileBoard;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileBoardMapper {

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "giangVienId", source = "giangVien.id")
    FileBoardResponse toDto(FileBoard fileBoard);

    @Mapping(target = "course.id", source = "courseId")
    @Mapping(target = "giangVien.id", source = "giangVienId")
    FileBoard toEntity(FileBoardUploadRequest dto);

    @Mapping(target = "createdAt", ignore = true)
    FileBoard toEntity(FileBoardResponse dto);
}