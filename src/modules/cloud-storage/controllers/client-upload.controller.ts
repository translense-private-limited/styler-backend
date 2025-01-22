import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { UploadFilesService } from '../services/upload-files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PresignedUrlResponseInterface } from '../interfaces/presigned-url-response.interface';
import { DeleteFileDto } from '../dtos/delete-file-dto';

@Controller('client')
@ApiTags('Client/Upload')
export class ClientUploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @ApiOperation({
    description:
      'Give outletId and mediaType and should send clientId or serviceId while trying to upload respective media',
    summary: 'client to get presigned url to upload',
  })
  @Put('generate-upload-url')
  async generateUploadUrl(
    @Body() keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {
    return await this.uploadFilesService.generatePreSignedUrlToUpload(
      keyGeneratorDto,
    );
  }

  @Get('signed-url')
  async getSignedUrl(@Query('key') key: string): Promise<string> {
    return await this.uploadFilesService.getSignedUrl(key);
  }

  @Delete('delete-file')
  async deleteFile(
    @Body() deleteFileDto:DeleteFileDto
  ):Promise<void>{
    return await this.uploadFilesService.deleteFileByKey(deleteFileDto.key,deleteFileDto.mediaType);
  }
}
