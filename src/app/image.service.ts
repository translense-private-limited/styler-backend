import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Buffer } from 'buffer';
import { Express } from 'express';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

@Injectable()
export class ImageService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: 'ap-south-1',
      endpoint: 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: 'Vk1dYfBgDM9XsKqmidJO',
        secretAccessKey: 'X4oS2A7fxxLlzMq5T0FZqME4yYMkBaC1B9i7fLWQ',
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET;
  }
  //@ts-expect-error //type failure
  async uploadImage(file: Express.Multer.File): Promise<string> {
    const key = `images/${uuidv4()}_${file.originalname}`;
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const uploadResponse = await this.s3Client.send(
        new PutObjectCommand(uploadParams),
      );
      // eslint-disable-next-line @/no-console
      console.log({ uploadResponse });
      return key;
    } catch (error) {
      throw new HttpException(
        'Error uploading image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getImage(key: string): Promise<Buffer> {
    const getParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const data = await this.s3Client.send(new GetObjectCommand(getParams));
      return await this.streamToBuffer(data.Body as Readable);
    } catch (error) {
      throw new HttpException('Error retrieving image', HttpStatus.NOT_FOUND);
    }
  }

  async deleteImage(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      throw new HttpException(
        'Error deleting image',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listImages(): Promise<string[]> {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: 'images/',
    };

    try {
      const data = await this.s3Client.send(
        new ListObjectsV2Command(listParams),
      );
      return data.Contents ? data.Contents.map((item) => item.Key) : [];
    } catch (error) {
      throw new HttpException(
        'Error listing images',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateSignedUrlForDownload(
    key: string,
    expiresInSeconds = 900,
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      return await getSignedUrl(this.s3Client, new GetObjectCommand(params), {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      throw new HttpException(
        'Error generating signed URL',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async generateSignedUrlForUpload(
    key: string,
    expiresInSeconds = 900,
  ): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: 'image/jpeg', // or any other content type you expect
    };

    try {
      return await getSignedUrl(this.s3Client, new PutObjectCommand(params), {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      throw new HttpException(
        'Error generating signed URL for upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
