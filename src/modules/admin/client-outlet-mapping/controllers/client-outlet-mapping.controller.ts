import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientOutletMappingService } from '../services/client-outlet-mapping.service';
import { ClientOutletIdDto } from '../dtos/client-outlet-id.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin/client-outlet-mapping')
@ApiTags('client-outlet-mapping')
export class ClientOutletMappingController {
  constructor(
    private readonly clientOutletMappingService: ClientOutletMappingService,
  ) {}

  @Post('map')
  async mapClientToOutlet(
    @Body() clientOutletIdDto: ClientOutletIdDto,
  ): Promise<string> {
    const result =
      await this.clientOutletMappingService.createClientOutletIdDto(
        clientOutletIdDto,
      );
    return result;
  }

  @Get('client/:clientId/outlets')
  async getOutletsForClient(
    @Param('clientId') clientId: number,
  ): Promise<number[]> {
    const outletIds =
      await this.clientOutletMappingService.getClientLinkedOutletIds(
        clientId,
      );
    return outletIds;
  }
}
