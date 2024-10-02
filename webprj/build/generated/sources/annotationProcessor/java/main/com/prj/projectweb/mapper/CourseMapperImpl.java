package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CertificateRequest;
import com.prj.projectweb.dto.request.CourseContentRequest;
import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Certificate;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseContent;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.TimeSlot;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-02T13:32:13+0700",
    comments = "version: 1.6.2, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.1.jar, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public Course toCourse(CourseRequest courseRequest) {
        if ( courseRequest == null ) {
            return null;
        }

        Course.CourseBuilder course = Course.builder();

        course.courseName( courseRequest.getCourseName() );
        course.courseContent( courseContentRequestListToCourseContentList( courseRequest.getCourseContent() ) );
        course.objective( courseRequest.getObjective() );
        course.duration( courseRequest.getDuration() );
        course.tuitionFee( courseRequest.getTuitionFee() );
        course.learningMethod( courseRequest.getLearningMethod() );
        course.certificate( certificateRequestToCertificate( courseRequest.getCertificate() ) );
        if ( courseRequest.getStartTime() != null ) {
            course.startTime( LocalDate.parse( courseRequest.getStartTime() ) );
        }
        if ( courseRequest.getEndTime() != null ) {
            course.endTime( LocalDate.parse( courseRequest.getEndTime() ) );
        }
        course.schedule( timeSlotRequestListToTimeSlotSet( courseRequest.getSchedule() ) );
        course.likes( courseRequest.getLikes() );
        course.image( courseRequest.getImage() );
        course.numberOfStudents( courseRequest.getNumberOfStudents() );
        course.object( courseRequest.getObject() );

        return course.build();
    }

    @Override
    public CourseRequest toCourseRequest(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseRequest.CourseRequestBuilder courseRequest = CourseRequest.builder();

        courseRequest.courseName( course.getCourseName() );
        courseRequest.courseContent( courseContentListToCourseContentRequestList( course.getCourseContent() ) );
        courseRequest.objective( course.getObjective() );
        courseRequest.duration( course.getDuration() );
        courseRequest.tuitionFee( course.getTuitionFee() );
        courseRequest.learningMethod( course.getLearningMethod() );
        courseRequest.certificate( certificateToCertificateRequest( course.getCertificate() ) );
        if ( course.getStartTime() != null ) {
            courseRequest.startTime( DateTimeFormatter.ISO_LOCAL_DATE.format( course.getStartTime() ) );
        }
        if ( course.getEndTime() != null ) {
            courseRequest.endTime( DateTimeFormatter.ISO_LOCAL_DATE.format( course.getEndTime() ) );
        }
        courseRequest.schedule( timeSlotSetToTimeSlotRequestList( course.getSchedule() ) );
        courseRequest.likes( course.getLikes() );
        courseRequest.image( course.getImage() );
        courseRequest.numberOfStudents( course.getNumberOfStudents() );
        courseRequest.object( course.getObject() );
        courseRequest.giangVien( giangVienToGiangVienRequest( course.getGiangVien() ) );

        return courseRequest.build();
    }

    @Override
    public CourseResponse toCourseResponse(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseResponse.CourseResponseBuilder courseResponse = CourseResponse.builder();

        courseResponse.nameOfGiangVien( courseGiangVienName( course ) );
        courseResponse.courseName( course.getCourseName() );
        courseResponse.objective( course.getObjective() );
        courseResponse.duration( course.getDuration() );
        courseResponse.tuitionFee( course.getTuitionFee() );
        courseResponse.startTime( course.getStartTime() );
        courseResponse.object( course.getObject() );
        courseResponse.image( course.getImage() );
        courseResponse.numberOfStudents( course.getNumberOfStudents() );
        courseResponse.likes( course.getLikes() );

        return courseResponse.build();
    }

    protected CourseContent courseContentRequestToCourseContent(CourseContentRequest courseContentRequest) {
        if ( courseContentRequest == null ) {
            return null;
        }

        CourseContent.CourseContentBuilder courseContent = CourseContent.builder();

        courseContent.session( courseContentRequest.getSession() );
        courseContent.title( courseContentRequest.getTitle() );
        List<String> list = courseContentRequest.getDetails();
        if ( list != null ) {
            courseContent.details( new ArrayList<String>( list ) );
        }

        return courseContent.build();
    }

    protected List<CourseContent> courseContentRequestListToCourseContentList(List<CourseContentRequest> list) {
        if ( list == null ) {
            return null;
        }

        List<CourseContent> list1 = new ArrayList<CourseContent>( list.size() );
        for ( CourseContentRequest courseContentRequest : list ) {
            list1.add( courseContentRequestToCourseContent( courseContentRequest ) );
        }

        return list1;
    }

    protected Certificate certificateRequestToCertificate(CertificateRequest certificateRequest) {
        if ( certificateRequest == null ) {
            return null;
        }

        Certificate.CertificateBuilder certificate = Certificate.builder();

        certificate.issued( certificateRequest.getIssued() );
        certificate.details( certificateRequest.getDetails() );

        return certificate.build();
    }

    protected TimeSlot timeSlotRequestToTimeSlot(TimeSlotRequest timeSlotRequest) {
        if ( timeSlotRequest == null ) {
            return null;
        }

        TimeSlot.TimeSlotBuilder timeSlot = TimeSlot.builder();

        timeSlot.day( timeSlotRequest.getDay() );
        timeSlot.timeRange( timeSlotRequest.getTimeRange() );

        return timeSlot.build();
    }

    protected Set<TimeSlot> timeSlotRequestListToTimeSlotSet(List<TimeSlotRequest> list) {
        if ( list == null ) {
            return null;
        }

        Set<TimeSlot> set = LinkedHashSet.newLinkedHashSet( list.size() );
        for ( TimeSlotRequest timeSlotRequest : list ) {
            set.add( timeSlotRequestToTimeSlot( timeSlotRequest ) );
        }

        return set;
    }

    protected CourseContentRequest courseContentToCourseContentRequest(CourseContent courseContent) {
        if ( courseContent == null ) {
            return null;
        }

        CourseContentRequest.CourseContentRequestBuilder courseContentRequest = CourseContentRequest.builder();

        courseContentRequest.session( courseContent.getSession() );
        courseContentRequest.title( courseContent.getTitle() );
        List<String> list = courseContent.getDetails();
        if ( list != null ) {
            courseContentRequest.details( new ArrayList<String>( list ) );
        }

        return courseContentRequest.build();
    }

    protected List<CourseContentRequest> courseContentListToCourseContentRequestList(List<CourseContent> list) {
        if ( list == null ) {
            return null;
        }

        List<CourseContentRequest> list1 = new ArrayList<CourseContentRequest>( list.size() );
        for ( CourseContent courseContent : list ) {
            list1.add( courseContentToCourseContentRequest( courseContent ) );
        }

        return list1;
    }

    protected CertificateRequest certificateToCertificateRequest(Certificate certificate) {
        if ( certificate == null ) {
            return null;
        }

        CertificateRequest.CertificateRequestBuilder certificateRequest = CertificateRequest.builder();

        certificateRequest.issued( certificate.getIssued() );
        certificateRequest.details( certificate.getDetails() );

        return certificateRequest.build();
    }

    protected TimeSlotRequest timeSlotToTimeSlotRequest(TimeSlot timeSlot) {
        if ( timeSlot == null ) {
            return null;
        }

        TimeSlotRequest.TimeSlotRequestBuilder timeSlotRequest = TimeSlotRequest.builder();

        timeSlotRequest.day( timeSlot.getDay() );
        timeSlotRequest.timeRange( timeSlot.getTimeRange() );

        return timeSlotRequest.build();
    }

    protected List<TimeSlotRequest> timeSlotSetToTimeSlotRequestList(Set<TimeSlot> set) {
        if ( set == null ) {
            return null;
        }

        List<TimeSlotRequest> list = new ArrayList<TimeSlotRequest>( set.size() );
        for ( TimeSlot timeSlot : set ) {
            list.add( timeSlotToTimeSlotRequest( timeSlot ) );
        }

        return list;
    }

    protected GiangVienRequest giangVienToGiangVienRequest(GiangVien giangVien) {
        if ( giangVien == null ) {
            return null;
        }

        GiangVienRequest.GiangVienRequestBuilder giangVienRequest = GiangVienRequest.builder();

        giangVienRequest.id( giangVien.getId() );
        giangVienRequest.name( giangVien.getName() );

        return giangVienRequest.build();
    }

    private String courseGiangVienName(Course course) {
        GiangVien giangVien = course.getGiangVien();
        if ( giangVien == null ) {
            return null;
        }
        return giangVien.getName();
    }
}
