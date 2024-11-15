package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.GiangVien;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface GiangVienMapper {

    @Mapping(target = "courses", ignore = true) // Bỏ qua trường courses khi thêm mới Giang Viên
    GiangVien toGiangVien(GiangVienRequest giangVienRequest);

    @Mapping(target = "dob", source = "dob", qualifiedByName = "localDateToString")
    @Mapping(target = "accountId", source = "user.userId")
    GiangVienResponse toGiangVienResponse(GiangVien giangVien);

    @Mapping(target = "courses", ignore = true)
    GiangVien dtoToGiangVien(GiangVienDTO giangVienDTO);

    @Mapping(target = "courses", ignore = true) // Bỏ qua trường courses khi cập nhật Giang Viên
    void updateGiangVienFromDto(GiangVienDTO giangVienDTO, @MappingTarget GiangVien giangVien);

    @Named("stringToLocalDate")
    default LocalDate stringToLocalDate(String dob) {
        return LocalDate.parse(dob, DateTimeFormatter.ISO_DATE);
    }

    @Named("localDateToString")
    default String localDateToString(LocalDate dob) {
        return dob.format(DateTimeFormatter.ISO_DATE);
    }
}
