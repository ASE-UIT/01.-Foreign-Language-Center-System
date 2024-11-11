package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.PaymentProofRequest;
import com.prj.projectweb.dto.response.PaymentProofResponse;
import com.prj.projectweb.entities.PaymentProof;
import org.springframework.web.multipart.MultipartFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentProofMapper {

    @Mapping(target = "fileName", source = "paymentProof.fileName")
    @Mapping(target = "fileType", source = "paymentProof.fileType")
    @Mapping(target = "uploadedBy", source = "paymentProof.uploadedBy")
    @Mapping(target = "uploadTime", source = "paymentProof.uploadTime")
    PaymentProofResponse toResponse(PaymentProof paymentProof);

    @Mapping(target = "fileName", source = "request.file.originalFilename")
    @Mapping(target = "fileType", source = "request.file.contentType")
    @Mapping(target = "fileData", source = "fileData")
    @Mapping(target = "uploadedBy", source = "request.uploadedBy")
    @Mapping(target = "uploadTime", expression = "java(java.time.LocalDateTime.now())")
    PaymentProof toEntity(PaymentProofRequest request, byte[] fileData);
}

