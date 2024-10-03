import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "@src/utils/entities/base.entity";

@Entity()
export class AtuhenticationEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}