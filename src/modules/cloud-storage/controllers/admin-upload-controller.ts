import { Body, Controller, Put } from "@nestjs/common";
import { KeyGeneratorDto } from "../dtos/key-generator.dto";
import { UploadFilesService } from "../services/upload-files.service";

@Controller('admin')
export class AdminUploadFilesController{
    constructor(
        private readonly uploadFilesService:UploadFilesService
    ){}

    @Put('generate-upload-url')
    async generateUploadUrl(
      @Body() keyGeneratorDto:KeyGeneratorDto
    ):Promise<string>{
      return await this.uploadFilesService.generatePreSignedUrlToUpload(keyGeneratorDto);
    }
}