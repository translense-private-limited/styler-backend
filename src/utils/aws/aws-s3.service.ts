import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  CopyObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

@Injectable()
export class AwsS3Service {
  private readonly logger = new Logger(AwsS3Service.name)
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    // Initialize the S3 client
    this.logger.log('Initializing S3 client...');
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'ap-south-1',
      endpoint: process.env.AWS_S3_ENDPOINT || 'http://localhost:9000',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'your-access-key',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'your-secret-key',
      },
    });

    this.bucketName = process.env.AWS_S3_BUCKET || 'styler-media';
    this.logger.log('S3 client initialized successfully.');
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

    this.logger.log(`Uploading file with key: ${key}`);
    try {
      await this.s3Client.send(new PutObjectCommand(uploadParams));
      this.logger.log(`File uploaded successfully: ${key}`);
      return key;
    } catch (error) {
      this.logger.error(`Error uploading file: ${key}`, error.stack);
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

    this.logger.log(`Downloading file with key: ${key}`);
    try {
      const data = await this.s3Client.send(new GetObjectCommand(getParams));
      this.logger.log(`File downloaded successfully: ${key}`);
      return await this.streamToBuffer(data.Body as Readable);
    } catch (error) {
      this.logger.error(`Error downloading file: ${key}`, error.stack);
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

    this.logger.log(`Deleting file with key: ${key}`);
    try {
      await this.s3Client.send(new DeleteObjectCommand(deleteParams));
      this.logger.log(`File deleted successfully: ${key}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${key}`, error.stack);
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

    this.logger.log(`Listing files with prefix: ${prefix}`);
    try {
      const data = await this.s3Client.send(
        new ListObjectsV2Command(listParams),
      );

      this.logger.log(`Found files with prefix: ${prefix}`);
      return data.Contents ? data.Contents.map((item) => item.Key) : [];
    } catch (error) {
      this.logger.error(`Error listing files with prefix: ${prefix}`, error.stack);
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
    this.logger.log(`Generating signed URL for download: ${key}`);
    const params = {
      Bucket: this.bucketName,
      Key: key,
    };

    try {
      this.logger.log(`Signed URL generated successfully: ${key}`);
      return await getSignedUrl(this.s3Client, new GetObjectCommand(params), {
        expiresIn: expiresInSeconds,
      });
    } catch (error) {
      this.logger.error(`Error generating signed URL for download: ${key}`, error.stack);
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
    const maxFileSizeBytes = maxFileSize * 1024 * 1024 * 90;

    if (!allowedTypes.includes(contentType)) {
      this.logger.warn(`Invalid file type: ${contentType}`);
      throw new HttpException(
        'Invalid file type. Allowed types are: ' + allowedTypes.join(', '),
        HttpStatus.BAD_REQUEST,
      );
    }
    
    this.logger.log(`Generating signed URL for upload: ${key}`);
    const params = {
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
      Conditions: [
        ['content-length-range', 0, maxFileSizeBytes],  // Min size 0, max size in bytes
      ],
    };

    try {
      const signedUrl =  await getSignedUrl(this.s3Client, new PutObjectCommand(params), {
        expiresIn: expiresInSeconds,
      });
      this.logger.log(`Signed URL generated successfully for upload: ${key}`);
      return signedUrl;
    } catch (error) {
      this.logger.error(`Error generating signed URL for upload: ${key}`, error.stack);
      throw new HttpException(
        'Error generating signed URL for upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async migrateFile(sourceKey: string, destinationKey: string): Promise<void> {
    const copyParams = {
      Bucket: this.bucketName,
      CopySource: `/${this.bucketName}/${sourceKey}`, // Format: /bucket-name/source-key
      Key: destinationKey,
    };

    this.logger.log(`Copying object from ${sourceKey} to ${destinationKey}`);

    try {
      await this.s3Client.send(new CopyObjectCommand(copyParams));
      this.logger.log(`Successfully copied ${sourceKey} to ${destinationKey}`);
    } catch (error) {
      this.logger.error(
        `Error copying object from ${sourceKey} to ${destinationKey}`,
        error.stack,
      );
      throw new HttpException(
        'Error copying object in S3',
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
    this.logger.log('Converting stream to buffer...');
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
