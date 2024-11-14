import { UserType } from "@modules/authorization/enums/usertype.enum";
import { ClientEntity } from "../entities/client.entity";

export class TeamMemberRole{

    client:ClientEntity;
    password:string;
    role:{
        id:number;
        name:string;
        isSystemDefined:boolean,
        scope:UserType,
        outletId:number|null
    };
}