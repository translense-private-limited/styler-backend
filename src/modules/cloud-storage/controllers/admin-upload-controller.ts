import { Body, Controller, Put,Get,Param, Post } from "@nestjs/common";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { UploadFilesService } from "../services/upload-files.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { PresignedUrlResponseInterface } from "../interfaces/presigned-url-response.interface";

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
    ):Promise<PresignedUrlResponseInterface>{
      return await this.uploadFilesService.generatePreSignedUrlToUpload(keyGeneratorDto);
    }
  @Get('signed-url/:key')
  async getSignedUrl(@Param('key') key: string): Promise<string> {
    return await this.uploadFilesService.getSignedUrl(key);
  }

  @Post('outlet/update-keys')
  async updateKeys(
    @Body('outletId') outletId:number
  ):Promise<void>{
    await this.uploadFilesService.updateOutletServiceKeys(outletId)
  }
}

