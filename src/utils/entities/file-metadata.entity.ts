import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { FileTypeEnum } from "../enums/file-type.enum";

@Entity('file_metadata')
export class FileMetadataEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    outletId:number;

    @Column({type:'varchar'})
    key:string;

    @Column()
    fileType:FileTypeEnum;
}