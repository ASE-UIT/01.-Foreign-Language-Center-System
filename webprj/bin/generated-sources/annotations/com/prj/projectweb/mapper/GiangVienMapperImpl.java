package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.User;
import java.time.LocalDate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-04T19:46:41+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
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
        giangVienResponse.accountId( giangVienUserUserId( giangVien ) );
        giangVienResponse.id( giangVien.getId() );
        giangVienResponse.name( giangVien.getName() );

        return giangVienResponse.build();
    }

    @Override
    public GiangVien dtoToGiangVien(GiangVienDTO giangVienDTO) {
        if ( giangVienDTO == null ) {
            return null;
        }

        GiangVien.GiangVienBuilder giangVien = GiangVien.builder();

        giangVien.dob( giangVienDTO.getDob() );
        giangVien.image( giangVienDTO.getImage() );
        giangVien.name( giangVienDTO.getName() );

        return giangVien.build();
    }

    @Override
    public void updateGiangVienFromDto(GiangVienDTO giangVienDTO, GiangVien giangVien) {
        if ( giangVienDTO == null ) {
            return;
        }

        giangVien.setDob( giangVienDTO.getDob() );
        giangVien.setImage( giangVienDTO.getImage() );
        giangVien.setName( giangVienDTO.getName() );
    }

    private Long giangVienUserUserId(GiangVien giangVien) {
        User user = giangVien.getUser();
        if ( user == null ) {
            return null;
        }
        return user.getUserId();
    }
}
