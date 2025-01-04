import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { MediaTypeEnum } from "@modules/cloud-storage/enums/media-type.enum";

@Entity('file_metadata')
export class FileMetadataEntity{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    outletId:number;

    @Column({type:'varchar'})
    key:string;

    @Column()
    mediaType:MediaTypeEnum;
}