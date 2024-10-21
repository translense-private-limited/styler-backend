import { Body, Controller, Post } from "@nestjs/common";
import { ClientOutletMappingService } from "../services/client-outlet-mapping.service";
import { ClientOutletIdDto } from "../dtos/client-outlet-id.dto";

@Controller('admin')
export class ClientOutletMappingController{
    constructor(private clientOutletMappingService: ClientOutletMappingService) {

    }

    @Post('link-client-outlet')
    async createClientOutletMapping(@Body() clientOutletIdDto: ClientOutletIdDto): Promise<string> {
        const mapping = await this.clientOutletMappingService.createClientOutletIdDto(clientOutletIdDto)
        return mapping
    }
}