import { Injectable } from "@nestjs/common";
import { ClientOutletMappingService } from "./client-outlet-mapping.service";
import { ClientOutletMappingRepository } from "../repositories/client-outlet-mapping.repository";

@Injectable()
export class ClientOutletMappingExternalService{
    constructor(private readonly clientOutletMappingService:ClientOutletMappingService,
          private readonly clientOutletMappingRepository:ClientOutletMappingRepository
    ){}

    async mapClientToOutlet(clientId: number, outletId: number): Promise<void> {
        await this.clientOutletMappingService.createClientOutletIdDto({ clientId, outletId });
      }

    async getMappingByOutletIdOrThrow(outletId: number) {
    const mapping = await this.clientOutletMappingRepository.getRepository().findOne({
        where: { outletId },
    });

    // Throw an error if no mapping is found
    if (!mapping) {
        throw new Error(`Mapping for client with ID ${outletId} not found`);
    }

    return mapping;
}

      
}