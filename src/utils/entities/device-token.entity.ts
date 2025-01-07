import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ApplicationPlatformEnum } from "../enums/application-platform.enum";
import { UserTypeEnum } from '@modules/authorization/enums/user-type.enum';
import { BaseEntity } from "./base.entity";


@Entity('device_token')
export class DeviceTokenEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    deviceToken:string;

    @Column()
    platform:ApplicationPlatformEnum;

    @Column()
    userId:number;

    @Column()
    userType:UserTypeEnum;

    @Column()
    isActive:boolean;
}