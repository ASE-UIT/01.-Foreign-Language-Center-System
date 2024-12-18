export interface LoginRequest{
    email:string
    password:string
}

export interface UserCreationRequest{
    email:string
    fullName:string
    phone:string
    address:string
    dob: Date
    image:string
    flag: number
    parentId: number
    centerId:number
}