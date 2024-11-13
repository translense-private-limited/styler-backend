import { Gender } from "@src/utils/enums/gender.enums";

export interface clientInterface{
    name:string;
    email:string;
    password?:string;
    contactNumber:string;
    roleId:number;
    gender:Gender;
    pastExperience:number;
    about:string;
    outletId:number;
}