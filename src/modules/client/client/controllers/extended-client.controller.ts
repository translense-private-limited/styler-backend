import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dtos/client.dto';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { ExtendedClient } from '../dtos/extended-client.dto';
import { ExtendedClientService } from '../services/extended-client.service';

@Controller('client')
@ApiTags('Client/ExtendedClients')
export class ExtendedClientController {
  constructor(
    private clientService: ClientService,
    private extendedClientService: ExtendedClientService,
  ) {}

  @ApiBearerAuth('jwt')
  @Get('extended-clients/outlet/:outletId')
  async getAllExtendedClientsForOutlet(
    @Param('outletId', ParseIntPipe) outletId: number,
  ): Promise<ExtendedClient[]> {
    return this.clientService.getAllExtendedClientsForOutlet(outletId);
  }

  @ApiBearerAuth('jwt')
  @Get('extended-client/:clientId')
  async getExtendedClientById(
    @Param('clientId', ParseIntPipe) clientId: number,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<ExtendedClient> {
    return this.clientService.getExtendedClientById(clientId, clientIdDto);
  }

  @ApiBearerAuth('jwt')
  @Post('extended-client')
  async createExtendedClient(
    @Body() createClientDto: CreateClientDto,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<ExtendedClient> {
    return this.clientService.createExtendedClient(createClientDto, clientIdDto);
  }

  @ApiBearerAuth('jwt')
  @Patch('extended-client/:clientId')
  async updateExtendedClient(
    @Param('clientId', ParseIntPipe) extendedClientId: number,
    @Body() updateExtendedClientDto: Partial<ExtendedClient>,
  ): Promise<ExtendedClient> {
    return await this.extendedClientService.updateExtendedClient(
      extendedClientId,
      updateExtendedClientDto,
    );
  }

  @ApiBearerAuth('jwt')
  @Delete('extended-client/:clientId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteExtendedClient(
    @Param('clientId', ParseIntPipe) extendedClientId: number,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<String> {
    await this.extendedClientService.deleteExtendedClient(extendedClientId, clientIdDto);
    return;
  }
}
