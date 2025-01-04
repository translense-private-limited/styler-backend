import { BaseEntity } from "@src/utils/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('outlet_docs')
export class OutletDocsEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    outletId:number;

    @Column({nullable:true})
    registration:string;

    @Column({nullable:true})
    gst:string;

    @Column({nullable:true})
    mou:string;

}