import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { UploadFilesService } from '../services/upload-files.service';

@Controller('admin')
export class AdminUploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Put('generate-upload-url')
  async generateUploadUrl(
    @Body() keyGeneratorDto: KeyGeneratorDto,
  ): Promise<string> {
    return await this.uploadFilesService.generatePreSignedUrlToUpload(
      keyGeneratorDto,
    );
  }

  // this is temp
  @Get('signed-url')
  async getSignedUrl(@Param('key') key: string): Promise<string> {
    const url = await this.uploadFilesService.getSignedUrl(key);
    return url;
  }
}
