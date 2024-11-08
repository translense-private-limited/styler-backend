export interface serviceInterface {
    categoryId: string;
    gender: Gender;
    serviceName: string;
    type: string; 
    price: number;
    timeTaken: number;
    about: string;
    description: string;
}
export enum Gender {
    Male = "male",
    Female = "female",
    Other = "other"
}
