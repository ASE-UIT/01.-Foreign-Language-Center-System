export type ApiResponse<T> = {
    code: number
    message: string
    result: T
}

export interface ParentResponse {
    userId: number;    // Long in Java -> number in TypeScript
    fullName: string;  // String -> string
    email: string;     // String -> string
}

export interface ChildOfParentResponse {
    id: string
    name: string
}

export interface LoginResponse {
    token: string
    authenticated: boolean
    role: string
    child: ChildOfParentResponse[]
}

export interface UserResponse {
    userId: string;
    email: string;
    username: string;
    password: string;
    fullName: string;
    phone: string;
    address: string;
    dob: string;
    role: string;
    centerId: number;
    children: ChildOfParentResponse[];
    parent: ParentResponse;
}

export interface ScheduleResponse {
  ca: string,
  courseName: string,
  courseSchedule: string,
  roomName: string,
  giangVien: string

}

