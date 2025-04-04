import { BaseEntity } from "@src/utils/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('client_docs')
export class ClientDocsEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    clientId:number;

    @Column({nullable:true})
    panKey:string;

    @Column({nullable:true})
    aadhaarKey:string;
}