import { Body, Controller, Put,Get,Param } from "@nestjs/common";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { UploadFilesService } from "../services/upload-files.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@Controller('admin')
@ApiTags('Admin/Upload')
export class AdminUploadFilesController{
    constructor(
        private readonly uploadFilesService:UploadFilesService
    ){}
    @ApiOperation({
      description:"Give outletId and mediaType and should send clientId or serviceId while trying to upload respective media",
      summary:"Admin to get presigned url to upload "
    })
    @Put('generate-upload-url')
    async generateUploadUrl(
      @Body() keyGeneratorDto:KeyGeneratorDto
    ):Promise<string>{
      return await this.uploadFilesService.generatePreSignedUrlToUpload(keyGeneratorDto);
    }
  // this is temp
  @Get('signed-url')
  async getSignedUrl(@Param('key') key: string): Promise<string> {
    const url = await this.uploadFilesService.getSignedUrl(key);
    return url;
  }
}

