package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CreateBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.entities.CenterBulletinBoard;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-07T11:44:11+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class CenterBulletinBoardMapperImpl implements CenterBulletinBoardMapper {

    @Override
    public CenterBulletinBoard toEntity(CreateBulletinBoardRequest request) {
        if ( request == null ) {
            return null;
        }

        CenterBulletinBoard.CenterBulletinBoardBuilder centerBulletinBoard = CenterBulletinBoard.builder();

        centerBulletinBoard.content( request.getContent() );
        centerBulletinBoard.department( request.getDepartment() );
        centerBulletinBoard.endDate( request.getEndDate() );
        centerBulletinBoard.name( request.getName() );
        centerBulletinBoard.startDate( request.getStartDate() );

        centerBulletinBoard.completionLevel( CenterBulletinBoard.CompletionLevel.NOT_DEFINED );
        centerBulletinBoard.status( CenterBulletinBoard.Status.IN_PROGRESS );

        return centerBulletinBoard.build();
    }

    @Override
    public CenterBulletinBoardResponse toResponse(CenterBulletinBoard centerBulletinBoard) {
        if ( centerBulletinBoard == null ) {
            return null;
        }

        CenterBulletinBoardResponse.CenterBulletinBoardResponseBuilder centerBulletinBoardResponse = CenterBulletinBoardResponse.builder();

        if ( centerBulletinBoard.getCompletionLevel() != null ) {
            centerBulletinBoardResponse.completionLevel( centerBulletinBoard.getCompletionLevel().name() );
        }
        centerBulletinBoardResponse.content( centerBulletinBoard.getContent() );
        centerBulletinBoardResponse.department( centerBulletinBoard.getDepartment() );
        centerBulletinBoardResponse.endDate( centerBulletinBoard.getEndDate() );
        centerBulletinBoardResponse.id( centerBulletinBoard.getId() );
        centerBulletinBoardResponse.name( centerBulletinBoard.getName() );
        centerBulletinBoardResponse.startDate( centerBulletinBoard.getStartDate() );
        if ( centerBulletinBoard.getStatus() != null ) {
            centerBulletinBoardResponse.status( centerBulletinBoard.getStatus().name() );
        }

        return centerBulletinBoardResponse.build();
    }

    @Override
    public CenterBulletinBoard updateEntity(UpdateBulletinBoardRequest request, CenterBulletinBoard centerBulletinBoard) {
        if ( request == null ) {
            return centerBulletinBoard;
        }

        if ( request.getCompletionLevel() != null ) {
            centerBulletinBoard.setCompletionLevel( Enum.valueOf( CenterBulletinBoard.CompletionLevel.class, request.getCompletionLevel() ) );
        }
        else {
            centerBulletinBoard.setCompletionLevel( null );
        }
        centerBulletinBoard.setContent( request.getContent() );
        centerBulletinBoard.setDepartment( request.getDepartment() );
        centerBulletinBoard.setEndDate( request.getEndDate() );
        centerBulletinBoard.setName( request.getName() );
        centerBulletinBoard.setStartDate( request.getStartDate() );
        if ( request.getStatus() != null ) {
            centerBulletinBoard.setStatus( Enum.valueOf( CenterBulletinBoard.Status.class, request.getStatus() ) );
        }
        else {
            centerBulletinBoard.setStatus( null );
        }

        return centerBulletinBoard;
    }
}
