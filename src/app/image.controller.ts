import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@src/utils/decorators/public.decorator';

@Controller('image')
@ApiTags('Image')
@Public()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    //@ts-ignore
    @UploadedFile() file: File,
  ): Promise<string> {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }
    return await this.imageService.uploadImage(file);
  }

  @Get(':key')
  async getImage(
    @Param('key') key: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const image = await this.imageService.getImage(key);
      res.setHeader('Content-Type', 'image/jpeg'); // Set appropriate content type
      res.send(image);
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }
  @Get('url/:key')
  async getImageUrl(@Param('key') key: string): Promise<string> {
    try {
      const signedUrl =
        await this.imageService.generateSignedUrlForDownload(key);

      return signedUrl;
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  @Post('url/:key')
  async getPresignedUrlToUpload(@Param('key') key: string): Promise<string> {
    try {
      const signedUrlToUpload =
        await this.imageService.generateSignedUrlForUpload(key);

      return signedUrlToUpload;
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  @Delete(':key')
  async deleteImage(@Param('key') key: string): Promise<string> {
    await this.imageService.deleteImage(key);
    return 'Image deleted successfully';
  }

  @Get()
  async listImages(): Promise<string[]> {
    return await this.imageService.listImages();
  }
}
