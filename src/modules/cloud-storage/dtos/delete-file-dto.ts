import { IsNotEmpty, IsString } from 'class-validator';
import { MediaTypeEnum } from '../enums/media-type.enum';

export class DeleteFileDto{
    @IsNotEmpty()
    @IsString()
    key: string;

    @IsNotEmpty()
    mediaType: MediaTypeEnum;
  }
