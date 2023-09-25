import { AutoMobileTypes } from "@prisma/client";

export interface AutoMobileInput {
    name:string;
    vehicleIdentificationNumber:string;
    type:AutoMobileTypes;
    brand:string;
    modelYear:string;
    color:string;
}
