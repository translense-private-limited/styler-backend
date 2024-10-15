import { UserEnum } from "@modules/atuhentication/enums/user.enum";
import { BaseEntity } from "@src/utils/entities/base.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('resources')
export class ResourceEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    resourceId: number

    @Column()
    name: string 

    @Column()
    label: string 

    @Column()
    user: UserEnum
}