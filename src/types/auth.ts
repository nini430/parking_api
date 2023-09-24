export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber:string;
  idNumber:string;
}


export interface LoginInput {
  email?:string;
  phoneNumber?:string;
  password:string;
}