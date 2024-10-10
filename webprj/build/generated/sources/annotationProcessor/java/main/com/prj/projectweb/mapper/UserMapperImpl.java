package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.UserCreationRequest;
import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.dto.response.UserResponse;
import com.prj.projectweb.entities.Role;
import com.prj.projectweb.entities.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-10T14:05:34+0700",
    comments = "version: 1.6.2, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.1.jar, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( request.getEmail() );
        user.fullName( request.getFullName() );
        user.phone( request.getPhone() );
        user.address( request.getAddress() );
        user.dob( request.getDob() );
        user.parentId( request.getParentId() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.role( userRoleRoleName( user ) );
        userResponse.email( user.getEmail() );
        userResponse.username( user.getUsername() );
        userResponse.password( user.getPassword() );
        userResponse.fullName( user.getFullName() );
        userResponse.phone( user.getPhone() );
        userResponse.address( user.getAddress() );
        userResponse.dob( user.getDob() );

        return userResponse.build();
    }

    @Override
    public ChildOfParentResponse toChildOfParentResponse(User child) {
        if ( child == null ) {
            return null;
        }

        ChildOfParentResponse.ChildOfParentResponseBuilder childOfParentResponse = ChildOfParentResponse.builder();

        childOfParentResponse.id( child.getUserId() );
        childOfParentResponse.name( child.getFullName() );

        return childOfParentResponse.build();
    }

    private String userRoleRoleName(User user) {
        Role role = user.getRole();
        if ( role == null ) {
            return null;
        }
        return role.getRoleName();
    }
}
