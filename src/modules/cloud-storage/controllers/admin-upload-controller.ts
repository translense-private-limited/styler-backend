import { Body, Controller, Put, Get, Query, Delete, Param } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { UploadFilesService } from '../services/upload-files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PresignedUrlResponseInterface } from '../interfaces/presigned-url-response.interface';

@Controller('admin')
@ApiTags('Admin/Upload')
export class AdminUploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}
  @ApiOperation({
    description:
      'Give outletId and mediaType and should send clientId or serviceId while trying to upload respective media',
    summary: 'Admin to get presigned url to upload ',
  })
  @Put('generate-upload-url')
  async generateUploadUrl(
    @Body() keyGeneratorDto: KeyGeneratorDto,
  ): Promise<PresignedUrlResponseInterface> {
    return await this.uploadFilesService.generatePreSignedUrlToUpload(
      keyGeneratorDto,
    );
  }
  // this is temp
  @Get('signed-url')
  async getSignedUrl(@Query('key') key: string): Promise<string> {
    const url = await this.uploadFilesService.getSignedUrl(key);
    return url;
  }

  @Delete('/delete-file/:key')
  async deleteFile(
    @Param('key') key:string,
  ):Promise<void>{
    return await this.uploadFilesService.deleteFile(key);
  }
}
