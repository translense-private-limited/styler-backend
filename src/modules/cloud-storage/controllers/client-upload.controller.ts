import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { UploadFilesService } from '../services/upload-files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  ): Promise<string> {
    return await this.uploadFilesService.generatePreSignedUrlToUpload(
      keyGeneratorDto,
    );
  }

  @Get('get-signed-url')
  @Get('signed-url/:key')
  async getSignedUrl(@Param('key') key: string): Promise<string> {
    return await this.uploadFilesService.getSignedUrl(key);
  }
}
