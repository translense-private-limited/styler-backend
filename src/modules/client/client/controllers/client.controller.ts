import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ClientService } from '../services/client.service';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ClientEntity } from '../entities/client.entity';
import { UpdateClientDto } from '../dtos/update-client.dto';

@Controller('client')
@ApiBearerAuth('jwt')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get('client/:clientId')
  async getClientById(
    @Param('  clientId', ParseIntPipe) clientId: number,
  ): Promise<ClientEntity> {
    return await this.clientService.getClientById(clientId);
  }

  @Patch('client/:clientId')
  async updateClient(
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() updateClientDto: UpdateClientDto,
  ): Promise<ClientEntity> {
    return this.clientService.updateClient(clientId, updateClientDto);
  }
}
