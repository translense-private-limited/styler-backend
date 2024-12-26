import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { PlatformEnum } from "../enums/platform.enum";
import { UserTypeEnum } from "@modules/authorization/enums/usertype.enum";

@Entity('device_token')
export class DeviceTokenEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    deviceToken:string;

    @Column()
    platform:PlatformEnum;

    @Column()
    userId:number;

    @Column()
    userType:UserTypeEnum;

    @Column()
    isActive:boolean;
}