import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dtos/client.dto';
import { Public } from '@src/utils/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth('jwt')
  @Get('clients')
  findAll() {
    return this.clientService.findAll();
  }

  @Post('client')
  @Public()
  async createSeller(@Body() createClientDto: CreateClientDto) {
    console.log('create seller called ');
    return this.clientService.createSeller(createClientDto);
  }
}
