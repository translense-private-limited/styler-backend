import { IsNotEmpty, IsOptional } from "class-validator";
import { MediaTypeEnum } from "../enums/media-type.enum";

export class KeyGeneratorDto{
    @IsNotEmpty()
    mediaType:MediaTypeEnum;

    @IsNotEmpty()
    outletId:number;

    @IsOptional()
    clientId?:number;

    @IsOptional()
    serviceId?:string;

    @IsOptional()
    subtypeId?:string;

    @IsOptional()
    count?:number;
}