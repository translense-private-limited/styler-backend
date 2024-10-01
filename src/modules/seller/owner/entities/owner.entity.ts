import { BaseEntity } from "@src/utils/entities/base.entity";
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OwnerEntity extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;
}
