package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CreateGlobalBulletinBoardRequest;
import com.prj.projectweb.dto.request.UpdateBulletinBoardRequest;
import com.prj.projectweb.dto.response.CenterBulletinBoardResponse;
import com.prj.projectweb.entities.GlobalBulletinBoard;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-04T19:46:42+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class GlobalBulletinBoardMapperImpl implements GlobalBulletinBoardMapper {

    @Override
    public GlobalBulletinBoard toEntity(CreateGlobalBulletinBoardRequest request) {
        if ( request == null ) {
            return null;
        }

        GlobalBulletinBoard.GlobalBulletinBoardBuilder globalBulletinBoard = GlobalBulletinBoard.builder();

        globalBulletinBoard.content( request.getContent() );
        globalBulletinBoard.department( request.getDepartment() );
        globalBulletinBoard.endDate( request.getEndDate() );
        globalBulletinBoard.name( request.getName() );
        globalBulletinBoard.startDate( request.getStartDate() );

        globalBulletinBoard.completionLevel( GlobalBulletinBoard.CompletionLevel.NOT_DEFINED );
        globalBulletinBoard.status( GlobalBulletinBoard.Status.IN_PROGRESS );

        return globalBulletinBoard.build();
    }

    @Override
    public CenterBulletinBoardResponse toResponse(GlobalBulletinBoard globalBulletinBoard) {
        if ( globalBulletinBoard == null ) {
            return null;
        }

        CenterBulletinBoardResponse.CenterBulletinBoardResponseBuilder centerBulletinBoardResponse = CenterBulletinBoardResponse.builder();

        if ( globalBulletinBoard.getCompletionLevel() != null ) {
            centerBulletinBoardResponse.completionLevel( globalBulletinBoard.getCompletionLevel().name() );
        }
        centerBulletinBoardResponse.content( globalBulletinBoard.getContent() );
        centerBulletinBoardResponse.department( globalBulletinBoard.getDepartment() );
        centerBulletinBoardResponse.endDate( globalBulletinBoard.getEndDate() );
        centerBulletinBoardResponse.id( globalBulletinBoard.getId() );
        centerBulletinBoardResponse.name( globalBulletinBoard.getName() );
        centerBulletinBoardResponse.startDate( globalBulletinBoard.getStartDate() );
        if ( globalBulletinBoard.getStatus() != null ) {
            centerBulletinBoardResponse.status( globalBulletinBoard.getStatus().name() );
        }

        return centerBulletinBoardResponse.build();
    }

    @Override
    public GlobalBulletinBoard updateEntity(UpdateBulletinBoardRequest request, GlobalBulletinBoard globalBulletinBoard) {
        if ( request == null ) {
            return globalBulletinBoard;
        }

        if ( request.getCompletionLevel() != null ) {
            globalBulletinBoard.setCompletionLevel( Enum.valueOf( GlobalBulletinBoard.CompletionLevel.class, request.getCompletionLevel() ) );
        }
        else {
            globalBulletinBoard.setCompletionLevel( null );
        }
        globalBulletinBoard.setContent( request.getContent() );
        globalBulletinBoard.setDepartment( request.getDepartment() );
        globalBulletinBoard.setEndDate( request.getEndDate() );
        globalBulletinBoard.setName( request.getName() );
        globalBulletinBoard.setStartDate( request.getStartDate() );
        if ( request.getStatus() != null ) {
            globalBulletinBoard.setStatus( Enum.valueOf( GlobalBulletinBoard.Status.class, request.getStatus() ) );
        }
        else {
            globalBulletinBoard.setStatus( null );
        }

        return globalBulletinBoard;
    }
}
