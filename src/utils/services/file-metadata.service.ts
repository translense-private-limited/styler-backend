import { Injectable } from "@nestjs/common";
import { FileMetaDataRepository } from "../repositories/file-metadata.Repository";
import { MediaTypeEnum } from "@modules/cloud-storage/enums/media-type.enum";

@Injectable()
export class FileMetadataService {
  constructor(
    private readonly fileMetadataRepository: FileMetaDataRepository
  ) {}

  public async saveFileMetadata(outletId: number, key: string, mediaType: MediaTypeEnum): Promise<void> {
    await this.fileMetadataRepository.getRepository().save({
        outletId,
        key: key,
        mediaType,
      });
  }
}
