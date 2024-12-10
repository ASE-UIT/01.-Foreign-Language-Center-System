package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.response.CenterResponse;
import com.prj.projectweb.entities.Center;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-10T23:55:26+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class CenterMapperImpl implements CenterMapper {

    @Override
    public CenterResponse toResponse(Center center) {
        if ( center == null ) {
            return null;
        }

        CenterResponse.CenterResponseBuilder centerResponse = CenterResponse.builder();

        centerResponse.address( center.getAddress() );
        centerResponse.city( center.getCity() );
        centerResponse.district( center.getDistrict() );
        centerResponse.email( center.getEmail() );
        centerResponse.id( center.getId() );
        centerResponse.name( center.getName() );
        centerResponse.ward( center.getWard() );

        return centerResponse.build();
    }
}
