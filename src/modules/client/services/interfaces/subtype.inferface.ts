import { GenderEnum } from "@src/utils/enums/gender.enums";

export interface SubtypeInterface{
    name:string;
    gender:GenderEnum;
    price: number;
    timeTaken: number;
    discount?: number;
    description?: string;
    about?:string
    subtypeImage?:string;
}