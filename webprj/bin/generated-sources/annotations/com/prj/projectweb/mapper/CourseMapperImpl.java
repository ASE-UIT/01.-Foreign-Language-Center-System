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
import com.prj.projectweb.entities.Room;
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
    date = "2024-11-14T19:31:46+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241023-1306, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class CourseMapperImpl implements CourseMapper {

    @Override
    public Course toCourse(CourseRequest courseRequest) {
        if ( courseRequest == null ) {
            return null;
        }

        Course.CourseBuilder course = Course.builder();

        course.certificate( certificateRequestToCertificate( courseRequest.getCertificate() ) );
        course.courseContent( courseContentRequestListToCourseContentList( courseRequest.getCourseContent() ) );
        course.courseName( courseRequest.getCourseName() );
        course.duration( courseRequest.getDuration() );
        if ( courseRequest.getEndTime() != null ) {
            course.endTime( LocalDate.parse( courseRequest.getEndTime() ) );
        }
        course.image( courseRequest.getImage() );
        course.learningMethod( courseRequest.getLearningMethod() );
        course.likes( courseRequest.getLikes() );
        course.numberOfStudents( courseRequest.getNumberOfStudents() );
        course.object( courseRequest.getObject() );
        course.objective( courseRequest.getObjective() );
        course.schedule( map( courseRequest.getSchedule() ) );
        if ( courseRequest.getStartTime() != null ) {
            course.startTime( LocalDate.parse( courseRequest.getStartTime() ) );
        }
        course.tuitionFee( courseRequest.getTuitionFee() );

        return course.build();
    }

    @Override
    public CourseRequest toCourseRequest(Course course) {
        if ( course == null ) {
            return null;
        }

        CourseRequest.CourseRequestBuilder courseRequest = CourseRequest.builder();

        courseRequest.room( courseRoomRoomName( course ) );
        courseRequest.certificate( certificateToCertificateRequest( course.getCertificate() ) );
        courseRequest.courseContent( courseContentListToCourseContentRequestList( course.getCourseContent() ) );
        courseRequest.courseName( course.getCourseName() );
        courseRequest.duration( course.getDuration() );
        if ( course.getEndTime() != null ) {
            courseRequest.endTime( DateTimeFormatter.ISO_LOCAL_DATE.format( course.getEndTime() ) );
        }
        courseRequest.giangVien( giangVienToGiangVienRequest( course.getGiangVien() ) );
        courseRequest.image( course.getImage() );
        courseRequest.learningMethod( course.getLearningMethod() );
        courseRequest.likes( course.getLikes() );
        courseRequest.numberOfStudents( course.getNumberOfStudents() );
        courseRequest.object( course.getObject() );
        courseRequest.objective( course.getObjective() );
        courseRequest.schedule( mapToIds( course.getSchedule() ) );
        if ( course.getStartTime() != null ) {
            courseRequest.startTime( DateTimeFormatter.ISO_LOCAL_DATE.format( course.getStartTime() ) );
        }
        courseRequest.tuitionFee( course.getTuitionFee() );

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
        courseResponse.duration( course.getDuration() );
        courseResponse.image( course.getImage() );
        courseResponse.likes( course.getLikes() );
        courseResponse.numberOfStudents( course.getNumberOfStudents() );
        courseResponse.object( course.getObject() );
        courseResponse.objective( course.getObjective() );
        courseResponse.startTime( course.getStartTime() );
        courseResponse.tuitionFee( course.getTuitionFee() );

        return courseResponse.build();
    }

    @Override
    public Set<TimeSlotRequest> toTimeSlotRequestSet(Set<TimeSlot> timeSlots) {
        if ( timeSlots == null ) {
            return null;
        }

        Set<TimeSlotRequest> set = new LinkedHashSet<TimeSlotRequest>( Math.max( (int) ( timeSlots.size() / .75f ) + 1, 16 ) );
        for ( TimeSlot timeSlot : timeSlots ) {
            set.add( timeSlotToTimeSlotRequest( timeSlot ) );
        }

        return set;
    }

    @Override
    public Set<TimeSlot> toTimeSlotSet(Set<TimeSlotRequest> timeSlotRequests) {
        if ( timeSlotRequests == null ) {
            return null;
        }

        Set<TimeSlot> set = new LinkedHashSet<TimeSlot>( Math.max( (int) ( timeSlotRequests.size() / .75f ) + 1, 16 ) );
        for ( TimeSlotRequest timeSlotRequest : timeSlotRequests ) {
            set.add( timeSlotRequestToTimeSlot( timeSlotRequest ) );
        }

        return set;
    }

    @Override
    public void updateCourse(Course course, CourseRequest courseRequest) {
        if ( courseRequest == null ) {
            return;
        }

        if ( course.getCourseContent() != null ) {
            List<CourseContent> list = courseContentRequestListToCourseContentList( courseRequest.getCourseContent() );
            if ( list != null ) {
                course.getCourseContent().clear();
                course.getCourseContent().addAll( list );
            }
            else {
                course.setCourseContent( null );
            }
        }
        else {
            List<CourseContent> list = courseContentRequestListToCourseContentList( courseRequest.getCourseContent() );
            if ( list != null ) {
                course.setCourseContent( list );
            }
        }
        course.setCourseName( courseRequest.getCourseName() );
        course.setDuration( courseRequest.getDuration() );
        if ( courseRequest.getEndTime() != null ) {
            course.setEndTime( LocalDate.parse( courseRequest.getEndTime() ) );
        }
        else {
            course.setEndTime( null );
        }
        course.setImage( courseRequest.getImage() );
        course.setLearningMethod( courseRequest.getLearningMethod() );
        course.setLikes( courseRequest.getLikes() );
        course.setNumberOfStudents( courseRequest.getNumberOfStudents() );
        course.setObject( courseRequest.getObject() );
        course.setObjective( courseRequest.getObjective() );
        if ( course.getSchedule() != null ) {
            Set<TimeSlot> set = map( courseRequest.getSchedule() );
            if ( set != null ) {
                course.getSchedule().clear();
                course.getSchedule().addAll( set );
            }
            else {
                course.setSchedule( null );
            }
        }
        else {
            Set<TimeSlot> set = map( courseRequest.getSchedule() );
            if ( set != null ) {
                course.setSchedule( set );
            }
        }
        if ( courseRequest.getStartTime() != null ) {
            course.setStartTime( LocalDate.parse( courseRequest.getStartTime() ) );
        }
        else {
            course.setStartTime( null );
        }
        course.setTuitionFee( courseRequest.getTuitionFee() );
        if ( courseRequest.getCertificate() != null ) {
            if ( course.getCertificate() == null ) {
                course.setCertificate( Certificate.builder().build() );
            }
            certificateRequestToCertificate1( courseRequest.getCertificate(), course.getCertificate() );
        }
        else {
            course.setCertificate( null );
        }
    }

    protected Certificate certificateRequestToCertificate(CertificateRequest certificateRequest) {
        if ( certificateRequest == null ) {
            return null;
        }

        Certificate.CertificateBuilder certificate = Certificate.builder();

        certificate.details( certificateRequest.getDetails() );
        certificate.issued( certificateRequest.getIssued() );

        return certificate.build();
    }

    protected CourseContent courseContentRequestToCourseContent(CourseContentRequest courseContentRequest) {
        if ( courseContentRequest == null ) {
            return null;
        }

        CourseContent.CourseContentBuilder courseContent = CourseContent.builder();

        List<String> list = courseContentRequest.getDetails();
        if ( list != null ) {
            courseContent.details( new ArrayList<String>( list ) );
        }
        courseContent.session( courseContentRequest.getSession() );
        courseContent.title( courseContentRequest.getTitle() );

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

    private String courseRoomRoomName(Course course) {
        Room room = course.getRoom();
        if ( room == null ) {
            return null;
        }
        return room.getRoomName();
    }

    protected CertificateRequest certificateToCertificateRequest(Certificate certificate) {
        if ( certificate == null ) {
            return null;
        }

        CertificateRequest.CertificateRequestBuilder certificateRequest = CertificateRequest.builder();

        certificateRequest.details( certificate.getDetails() );
        certificateRequest.issued( certificate.getIssued() );

        return certificateRequest.build();
    }

    protected CourseContentRequest courseContentToCourseContentRequest(CourseContent courseContent) {
        if ( courseContent == null ) {
            return null;
        }

        CourseContentRequest.CourseContentRequestBuilder courseContentRequest = CourseContentRequest.builder();

        List<String> list = courseContent.getDetails();
        if ( list != null ) {
            courseContentRequest.details( new ArrayList<String>( list ) );
        }
        courseContentRequest.session( courseContent.getSession() );
        courseContentRequest.title( courseContent.getTitle() );

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

    protected TimeSlotRequest timeSlotToTimeSlotRequest(TimeSlot timeSlot) {
        if ( timeSlot == null ) {
            return null;
        }

        TimeSlotRequest.TimeSlotRequestBuilder timeSlotRequest = TimeSlotRequest.builder();

        timeSlotRequest.day( timeSlot.getDay() );
        timeSlotRequest.timeRange( timeSlot.getTimeRange() );

        return timeSlotRequest.build();
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

    protected void certificateRequestToCertificate1(CertificateRequest certificateRequest, Certificate mappingTarget) {
        if ( certificateRequest == null ) {
            return;
        }

        mappingTarget.setDetails( certificateRequest.getDetails() );
        mappingTarget.setIssued( certificateRequest.getIssued() );
    }
}
