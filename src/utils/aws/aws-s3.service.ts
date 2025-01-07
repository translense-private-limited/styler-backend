import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Initialize the S3 client
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key',
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET || 'styler-outlet-media';
  }

  /**
   * Uploads a file to AWS S3.
   * @param fileBuffer - The buffer of the file to be uploaded.
   * @param key - The key (path) where the file should be stored in S3.
   * @param contentType - The MIME type of the file (e.g., 'image/jpeg').
   * @returns The key of the uploaded file.
   */
  async uploadFile(
    fileBuffer: Buffer,
    key: string,
    contentType: string,
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    };

    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      return key;
    } catch (error) {
      throw new HttpException(
        'Error uploading file to S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Downloads a file from AWS S3.
   * @param key - The key (path) of the file in S3.
   * @returns The file as a Buffer.
   */
  async downloadFile(key: string): Promise<Buffer> {
    const getParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      const data = await this.s3Client.send(new GetObjectCommand(getParams));
      return await this.streamToBuffer(data.Body as Readable);
    } catch (error) {
      throw new HttpException(
        'Error downloading file from S3',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Deletes a file from AWS S3.
   * @param key - The key (path) of the file in S3.
   */
  async deleteFile(key: string): Promise<void> {
    const deleteParams = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    } catch (error) {
      throw new HttpException(
        'Error deleting file from S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Lists all files in a specific prefix (directory) in AWS S3.
   * @param prefix - The prefix (directory path) to list files from.
   * @returns An array of file keys.
   */
  async listFiles(prefix: string): Promise<string[]> {
    const listParams = {
      Bucket: this.bucketName,
      Prefix: prefix,
    };

    try {
      const data = await this.s3Client.send(
        new ListObjectsV2Command(listParams),
      );
      return data.Contents ? data.Contents.map((item) => item.Key) : [];
    } catch (error) {
      throw new HttpException(
        'Error listing files in S3',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generates a pre-signed URL for downloading a file.
   * @param key - The key (path) of the file in S3.
   * @param expiresInSeconds - Expiry time for the URL in seconds (default: 900s).
   * @returns The pre-signed download URL.
   */
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
        'Error generating signed URL for download',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Generates a pre-signed URL for uploading a file.
   * @param key - The key (path) where the file should be uploaded in S3.
   * @param contentType - The MIME type of the file (e.g., 'image/jpeg').
   * @param expiresInSeconds - Expiry time for the URL in seconds (default: 900s).
   * @returns The pre-signed upload URL.
   */
  async generateSignedUrlForUpload(
    key: string,
    contentType: string,
    maxFileSize: number,
    allowedTypes:string[],
    expiresInSeconds = 900,
  ): Promise<string> {
    const maxFileSizeBytes = maxFileSize * 1024 * 1024;

    if (!allowedTypes.includes(contentType)) {
      throw new HttpException(
        'Invalid file type. Allowed types are: ' + allowedTypes.join(', '),
        HttpStatus.BAD_REQUEST,
      );
    }
  
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      Conditions: [
        ['content-length-range', 0, maxFileSizeBytes],  // Min size 0, max size in bytes
      ],
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

  /**
   * Helper function to convert a Readable stream to a Buffer.
   * @param stream - The Readable stream.
   * @returns The Buffer.
   */
  private async streamToBuffer(stream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
