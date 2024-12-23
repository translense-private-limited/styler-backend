import { Injectable } from '@nestjs/common';
import { ClientOutletMappingRepository } from '../repositories/client-outlet-mapping.repository';
import { ClientExternalService } from '@modules/client/client/services/client-external.service';

import { OutletExternalService } from '@modules/client/outlet/services/outlet-external.service';
import { ClientOutletIdDto } from '../dtos/client-outlet-id.dto';
import { ClientOutletMappingEntity } from '../entities/client-outlet-mapping.entity';

@Injectable()
export class ClientOutletMappingService {
  constructor(
    private clientOutletMappingRepository: ClientOutletMappingRepository,
    private clientExternalService: ClientExternalService,
    private outletExternalService: OutletExternalService,
  ) {}

  async getClientOutletMapping(
    clientOutletIdDto: ClientOutletIdDto,
  ): Promise<ClientOutletMappingEntity> {
    const { clientId, outletId } = clientOutletIdDto;
    const clientOutletMapping = await this.clientOutletMappingRepository
      .getRepository()
      .findOne({
        where: {
          clientId,
          outletId,
        },
      });

    return clientOutletMapping;
  }

  async createClientOutletIdDto(
    clientOutletIdDto: ClientOutletIdDto,
  ): Promise<string> {
    const { clientId, outletId } = clientOutletIdDto;

    await this.clientExternalService.getClientById(clientId);
    await this.outletExternalService.getOutletById(outletId);

    const existingClientOutletMapping =
      await this.getClientOutletMapping(clientOutletIdDto);

    if (!existingClientOutletMapping) {
      await this.clientOutletMappingRepository
        .getRepository()
        .save({ clientId, outletId });

      return 'mapping created successfully ';
    }

    return 'client belongs to outlet';
  }

  async getClientLinkedOutletIds(clientId: number): Promise<number[]> {
    const mapping = await this.clientOutletMappingRepository
      .getRepository()
      .find({
        where: {
          clientId: clientId,
        },
      });

    const outletIds = mapping.map(
      (clientOutletMapping) => clientOutletMapping.outletId,
    );
    return outletIds;
  }
}
