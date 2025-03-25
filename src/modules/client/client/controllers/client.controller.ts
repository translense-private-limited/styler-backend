import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dtos/client.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { ClientEntity } from '../entities/client.entity';

@Controller('client')
@ApiBearerAuth('jwt')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get('client/:clientId')
  async getClientById(
    @Param('  clientId', ParseIntPipe) clientId: number,
  ): Promise<ClientEntity> {
    return await this.clientService.getClientById(clientId);
  }
}
