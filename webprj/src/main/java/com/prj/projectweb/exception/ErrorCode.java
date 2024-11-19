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
    TIMESLOT_NOTFOUND(1015, "Timeslot not found", HttpStatus.NOT_FOUND),
    TIMESLOT_EXISTED(1016, "Timeslot existed", HttpStatus.BAD_REQUEST),
    TEACHER_NOTFOUND(1017, "Teacher not found", HttpStatus.NOT_FOUND),
    COURSE_UPDATE_FAILED(1018, "Course update failed", HttpStatus.INTERNAL_SERVER_ERROR),
    USER_NOTFOUND(1019, "User not found", HttpStatus.NOT_FOUND),
    NEW_PASSWORD_NOTMATCH(1020, "New passwords not match", HttpStatus.BAD_REQUEST),
    FILE_NOTFOUND(1021, "File not found", HttpStatus.NOT_FOUND),
    ROOM_EXISTED(1022, "Room existed", HttpStatus.BAD_REQUEST),
    ROOM_NOT_AVAILABLE(1023, "Room not available", HttpStatus.BAD_REQUEST),
    ROOM_NOTFOUND(1024, "Room not found", HttpStatus.NOT_FOUND),
    INVALID_VOTE(1025, "Invalid vote", HttpStatus.BAD_REQUEST),
    REGISTRATION_NOT_FOUND(1026, "Registration not found", HttpStatus.NOT_FOUND),
    UNAUTHORIZED_ACTION(1027, "You do not have permission to perform this action", HttpStatus.FORBIDDEN),
    COURSE_REGISTRATION_NOTFOUND(1028, "Course registration not found", HttpStatus.NOT_FOUND),
    PAYMENT_PROOF_NOTFOUND(1029, "Payment proof not found", HttpStatus.NOT_FOUND),
    SEND_EMAIL_FAILED(1030, "Send email failed", HttpStatus.BAD_REQUEST),
    INVALID_ROLE_FLAG(1031, "Invalid flag role", HttpStatus.BAD_REQUEST),
    CENTER_NOTFOUND(1032, "Center not found", HttpStatus.NOT_FOUND),
    CENTER_NOTMATCH(1033, "Not in the same center", HttpStatus.BAD_REQUEST),
    EXPENSE_NOTFOUND(1034, "Expense not found", HttpStatus.NOT_FOUND),
    SALARY_NOTFOUND(1035, "Salary not found", HttpStatus.NOT_FOUND),
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
