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
    date = "2024-10-11T08:48:15+0700",
    comments = "version: 1.6.2, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.1.jar, environment: Java 21.0.2 (Oracle Corporation)"
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
        giangVienResponse.id( giangVien.getId() );
        giangVienResponse.name( giangVien.getName() );
        giangVienResponse.likes( giangVien.getLikes() );
        giangVienResponse.dislikes( giangVien.getDislikes() );

        return giangVienResponse.build();
    }

    @Override
    public GiangVien dtoToGiangVien(GiangVienDTO giangVienDTO) {
        if ( giangVienDTO == null ) {
            return null;
        }

        GiangVien.GiangVienBuilder giangVien = GiangVien.builder();

        giangVien.name( giangVienDTO.getName() );
        giangVien.dob( giangVienDTO.getDob() );
        giangVien.likes( giangVienDTO.getLikes() );
        giangVien.dislikes( giangVienDTO.getDislikes() );

        return giangVien.build();
    }
}
