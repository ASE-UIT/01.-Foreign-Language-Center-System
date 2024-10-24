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
    date = "2024-10-24T11:05:53+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.v20240919-1711, environment: Java 17.0.12 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(UserCreationRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.address( request.getAddress() );
        user.dob( request.getDob() );
        user.email( request.getEmail() );
        user.fullName( request.getFullName() );
        user.parentId( request.getParentId() );
        user.phone( request.getPhone() );

        return user.build();
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.role( userRoleRoleName( user ) );
        userResponse.address( user.getAddress() );
        userResponse.dob( user.getDob() );
        userResponse.email( user.getEmail() );
        userResponse.fullName( user.getFullName() );
        userResponse.password( user.getPassword() );
        userResponse.phone( user.getPhone() );
        userResponse.username( user.getUsername() );

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
