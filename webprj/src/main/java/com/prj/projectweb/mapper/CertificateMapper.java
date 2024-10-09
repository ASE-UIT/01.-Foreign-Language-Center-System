package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CertificateRequest;
import com.prj.projectweb.entities.Certificate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CertificateMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    Certificate toCertificate(CertificateRequest certificateRequest);
}
