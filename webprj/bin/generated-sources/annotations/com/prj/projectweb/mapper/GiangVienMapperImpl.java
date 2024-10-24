package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.GiangVien;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-24T19:13:11+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.v20240919-1711, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class GiangVienMapperImpl implements GiangVienMapper {

    @Override
    public GiangVien toGiangVien(GiangVienRequest giangVienRequest) {
        if ( giangVienRequest == null ) {
            return null;
        }

        GiangVien.GiangVienBuilder giangVien = GiangVien.builder();

        giangVien.id( giangVienRequest.getId() );
        giangVien.name( giangVienRequest.getName() );

        return giangVien.build();
    }

    @Override
    public GiangVienResponse toGiangVienResponse(GiangVien giangVien) {
        if ( giangVien == null ) {
            return null;
        }

        GiangVienResponse.GiangVienResponseBuilder giangVienResponse = GiangVienResponse.builder();

        if ( giangVien.getDob() != null ) {
            giangVienResponse.dob( LocalDate.parse( localDateToString( giangVien.getDob() ) ) );
        }
        giangVienResponse.dislikes( giangVien.getDislikes() );
        giangVienResponse.id( giangVien.getId() );
        giangVienResponse.likes( giangVien.getLikes() );
        giangVienResponse.name( giangVien.getName() );

        return giangVienResponse.build();
    }

    @Override
    public GiangVien dtoToGiangVien(GiangVienDTO giangVienDTO) {
        if ( giangVienDTO == null ) {
            return null;
        }

        GiangVien.GiangVienBuilder giangVien = GiangVien.builder();

        giangVien.dislikes( giangVienDTO.getDislikes() );
        giangVien.dob( giangVienDTO.getDob() );
        giangVien.likes( giangVienDTO.getLikes() );
        giangVien.name( giangVienDTO.getName() );

        return giangVien.build();
    }
}
