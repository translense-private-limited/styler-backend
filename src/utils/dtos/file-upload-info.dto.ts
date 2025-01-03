import { IsEnum, IsInt, IsString } from 'class-validator';
import { FileTypeEnum } from '../enums/file-type.enum';

export class FileUploadInfoDto {
  @IsInt()
  outletId: number;

  @IsString()
  fileName: string;

  @IsEnum(FileTypeEnum)
  fileType: FileTypeEnum;
}
