import { Injectable } from "@nestjs/common";
import { ClientOutletMappingRepository } from "../repositories/client-outlet-mapping.repository";
import { ClientExternalService } from "@modules/client/client/services/client-external.service";
import { OutletController } from "@modules/client/outlet/controllers/outlet.controller";
import { OutletExternalService } from "@modules/client/outlet/services/outlet-external.service";
import { ClientOutletIdDto } from "../dtos/client-outlet-id.dto";

@Injectable()
export class ClientOutletMappingService {
    constructor(
        private clientOutletMappingRepository: ClientOutletMappingRepository,
        private clientExternalService: ClientExternalService,
        private outletExternalService: OutletExternalService
    ){
       
    }

    async getClientOutletMapping(clientOutletIdDto: ClientOutletIdDto): Promise<any> {
        const { clientId, outletId  } = clientOutletIdDto
        const clientOutletMapping = await this.clientOutletMappingRepository.getRepository().findOne({ where : {
            clientId,
            outletId
        }})

        return clientOutletMapping
    }

    async createClientOutletIdDto(clientOutletIdDto: ClientOutletIdDto): Promise<any> {
        const { clientId, outletId  } = clientOutletIdDto

        const client = await this.clientExternalService.getClientById(clientId)
        const outlet = await this.outletExternalService.getOutletById(outletId)

        const existingClientOutletMapping = await this.getClientOutletMapping(clientOutletIdDto)

        if(!existingClientOutletMapping){
             await this.clientOutletMappingRepository.getRepository().save({ clientId, outletId})
            
            return 'mapping created successfully '
        }

        return 'client belongs to outlet'

    }

    
}