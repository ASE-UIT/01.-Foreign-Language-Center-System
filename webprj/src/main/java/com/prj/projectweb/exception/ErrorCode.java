package com.prj.projectweb.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    INVALID_KEY(1111, "Invalid message key", HttpStatus.BAD_REQUEST),
    USER_EXISTED(1001, "User existed", HttpStatus.BAD_REQUEST),
    TEACHER_EXISTED(1002, "Teacher existed", HttpStatus.BAD_REQUEST),
    COURSE_EXISTED(1003, "Course existed", HttpStatus.BAD_REQUEST),
    COURSE_NOTFOUND(1004, "Course not found", HttpStatus.NOT_FOUND),
    ROLE_NOTFOUND(1005, "Role not found", HttpStatus.NOT_FOUND),
    PERMISSION_NOTFOUND(1006, "Permission not found", HttpStatus.NOT_FOUND),
    ROLE_EXISTED(1007, "Role existed", HttpStatus.BAD_REQUEST),
    PASSWORD_WRONG(1009, "Password wrong", HttpStatus.UNAUTHORIZED),
    EMAIL_WRONG(1010, "Email wrong", HttpStatus.UNAUTHORIZED),
    EMAIL_EXISTED(1011, "Email existed", HttpStatus.BAD_REQUEST),
    PARENT_NOTFOUND(1012, "Parent not found", HttpStatus.NOT_FOUND),
    INVALID_REQUEST(1014, "Parent must have role PhuHuynh.", HttpStatus.BAD_REQUEST),
    TIMESLOT_EXISTED(1015, "Time slot existed", HttpStatus.BAD_REQUEST),
    ;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }

    private int code;
    private String message;
    private HttpStatusCode statusCode;

}