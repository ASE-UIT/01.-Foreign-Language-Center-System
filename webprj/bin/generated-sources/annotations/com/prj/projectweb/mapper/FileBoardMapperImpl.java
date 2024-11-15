package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.FileBoardUploadRequest;
import com.prj.projectweb.dto.response.FileBoardResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.FileBoard;
import com.prj.projectweb.entities.GiangVien;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-15T22:53:13+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241023-1306, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class FileBoardMapperImpl implements FileBoardMapper {

    @Override
    public FileBoardResponse toDto(FileBoard fileBoard) {
        if ( fileBoard == null ) {
            return null;
        }

        FileBoardResponse fileBoardResponse = new FileBoardResponse();

        fileBoardResponse.setCourseId( fileBoardCourseId( fileBoard ) );
        fileBoardResponse.setGiangVienId( fileBoardGiangVienId( fileBoard ) );
        fileBoardResponse.setCenterId( fileBoardCenterId( fileBoard ) );
        fileBoardResponse.setCreatedAt( fileBoard.getCreatedAt() );
        fileBoardResponse.setDownloadLink( fileBoard.getDownloadLink() );
        fileBoardResponse.setFilename( fileBoard.getFilename() );
        fileBoardResponse.setId( fileBoard.getId() );
        fileBoardResponse.setPublic( fileBoard.isPublic() );

        return fileBoardResponse;
    }

    @Override
    public FileBoard toEntity(FileBoardUploadRequest dto) {
        if ( dto == null ) {
            return null;
        }

        FileBoard.FileBoardBuilder fileBoard = FileBoard.builder();

        fileBoard.course( fileBoardUploadRequestToCourse( dto ) );
        fileBoard.giangVien( fileBoardUploadRequestToGiangVien( dto ) );

        return fileBoard.build();
    }

    @Override
    public FileBoard toEntity(FileBoardResponse dto) {
        if ( dto == null ) {
            return null;
        }

        FileBoard.FileBoardBuilder fileBoard = FileBoard.builder();

        fileBoard.downloadLink( dto.getDownloadLink() );
        fileBoard.filename( dto.getFilename() );
        fileBoard.id( dto.getId() );

        return fileBoard.build();
    }

    private Long fileBoardCourseId(FileBoard fileBoard) {
        Course course = fileBoard.getCourse();
        if ( course == null ) {
            return null;
        }
        return course.getId();
    }

    private Long fileBoardGiangVienId(FileBoard fileBoard) {
        GiangVien giangVien = fileBoard.getGiangVien();
        if ( giangVien == null ) {
            return null;
        }
        return giangVien.getId();
    }

    private Long fileBoardCenterId(FileBoard fileBoard) {
        Center center = fileBoard.getCenter();
        if ( center == null ) {
            return null;
        }
        return center.getId();
    }

    protected Course fileBoardUploadRequestToCourse(FileBoardUploadRequest fileBoardUploadRequest) {
        if ( fileBoardUploadRequest == null ) {
            return null;
        }

        Course.CourseBuilder course = Course.builder();

        course.id( fileBoardUploadRequest.getCourseId() );

        return course.build();
    }

    protected GiangVien fileBoardUploadRequestToGiangVien(FileBoardUploadRequest fileBoardUploadRequest) {
        if ( fileBoardUploadRequest == null ) {
            return null;
        }

        GiangVien.GiangVienBuilder giangVien = GiangVien.builder();

        giangVien.id( fileBoardUploadRequest.getGiangVienId() );

        return giangVien.build();
    }
}
