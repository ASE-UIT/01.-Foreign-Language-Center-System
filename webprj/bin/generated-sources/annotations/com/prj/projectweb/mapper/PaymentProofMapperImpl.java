package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.PaymentProofRequest;
import com.prj.projectweb.dto.response.PaymentProofResponse;
import com.prj.projectweb.entities.PaymentProof;
import java.util.Arrays;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-10T22:09:01+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class PaymentProofMapperImpl implements PaymentProofMapper {

    @Override
    public PaymentProofResponse toResponse(PaymentProof paymentProof) {
        if ( paymentProof == null ) {
            return null;
        }

        PaymentProofResponse paymentProofResponse = new PaymentProofResponse();

        paymentProofResponse.setFileName( paymentProof.getFileName() );
        paymentProofResponse.setFileType( paymentProof.getFileType() );
        paymentProofResponse.setUploadedBy( paymentProof.getUploadedBy() );
        paymentProofResponse.setUploadTime( paymentProof.getUploadTime() );
        paymentProofResponse.setId( paymentProof.getId() );

        return paymentProofResponse;
    }

    @Override
    public PaymentProof toEntity(PaymentProofRequest request, byte[] fileData) {
        if ( request == null && fileData == null ) {
            return null;
        }

        PaymentProof paymentProof = new PaymentProof();

        if ( request != null ) {
            paymentProof.setFileName( requestFileOriginalFilename( request ) );
            paymentProof.setFileType( requestFileContentType( request ) );
            paymentProof.setUploadedBy( request.getUploadedBy() );
        }
        byte[] fileData1 = fileData;
        if ( fileData1 != null ) {
            paymentProof.setFileData( Arrays.copyOf( fileData1, fileData1.length ) );
        }
        paymentProof.setUploadTime( java.time.LocalDateTime.now() );

        return paymentProof;
    }

    private String requestFileOriginalFilename(PaymentProofRequest paymentProofRequest) {
        MultipartFile file = paymentProofRequest.getFile();
        if ( file == null ) {
            return null;
        }
        return file.getOriginalFilename();
    }

    private String requestFileContentType(PaymentProofRequest paymentProofRequest) {
        MultipartFile file = paymentProofRequest.getFile();
        if ( file == null ) {
            return null;
        }
        return file.getContentType();
    }
}
