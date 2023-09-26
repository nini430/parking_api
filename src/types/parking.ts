export interface ParkingInput {
    boughtHours:number;
    expireDate:number;
}

export type ParkingControllerInput=Omit<ParkingInput,'expireDate'>;

