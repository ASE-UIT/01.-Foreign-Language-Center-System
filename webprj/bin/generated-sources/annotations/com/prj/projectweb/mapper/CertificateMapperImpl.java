package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CertificateRequest;
import com.prj.projectweb.entities.Certificate;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-24T19:13:11+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.v20240919-1711, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class CertificateMapperImpl implements CertificateMapper {

    @Override
    public Certificate toCertificate(CertificateRequest certificateRequest) {
        if ( certificateRequest == null ) {
            return null;
        }

        Certificate.CertificateBuilder certificate = Certificate.builder();

        certificate.details( certificateRequest.getDetails() );
        certificate.issued( certificateRequest.getIssued() );

        return certificate.build();
    }
}
