import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { OtpTypeEnum } from "../enums/otp-type.enum";
import { OtpRepository } from "@modules/authentication/repositories/otp.repository";

@Entity('otp_verification')
export class OtpVerificationEntity extends OtpRepository{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientId:number;

    @Column()
    customerId:number;

    @Column()
    orderId:number;

    @Column()
    otp:number;

    @Column()
    type:OtpTypeEnum;

    @Column()
    expirationTime:Date;

}