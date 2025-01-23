import { Body, Controller, Delete, Get, Put, Query } from '@nestjs/common';
import { KeyGeneratorDto } from '../dtos/key-generator.dto';
import { UploadFilesService } from '../services/upload-files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PresignedUrlResponseInterface } from '../interfaces/presigned-url-response.interface';
import { DeleteFileDto } from '../dtos/delete-file-dto';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { unauthorized } from '@src/utils/exceptions/common.exception';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';

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
  async getSignedUrl(
    @Query('key') key: string,
    @ClientIdDecorator() clientIdDto:ClientIdDto
  ): Promise<string> {

    const outletId = parseInt(key.split('/')[0], 10);
    if (!clientIdDto.outletIds.includes(outletId)) {
      unauthorized('You do not have permission to access this media');
    }
    return await this.uploadFilesService.getSignedUrl(key);
  }

  @Delete('delete-media')
  async deleteMedia(
    @Body() deleteFileDto:DeleteFileDto,
  ):Promise<void>{
    return await this.uploadFilesService.deleteMediaByKey(deleteFileDto.key,deleteFileDto.mediaType);
  }
}
