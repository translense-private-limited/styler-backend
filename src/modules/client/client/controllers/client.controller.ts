import { Body, Controller, Get, Post,Param } from '@nestjs/common';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dtos/client.dto';
import { Public } from '@src/utils/decorators/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';

@Controller('client')
@ApiTags('Client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiBearerAuth('jwt')
  @Get('teams/:outletId') 
  async getAllTeamMembers(@Param('outletId') outletId: number) {
    if (!outletId) {
      throw new Error('outletId is missing in the request');
    }
    return this.clientService.getAllTeamMembers(outletId);
  }

  @Get(':outletId/:clientId')
  async getTeamMemeberByIdOrThrow(
    @Param('clientId') clientId:number,
    @Param('outletId') outletId:number
  ){
    if(!clientId){
      throw new Error('clientId is missing in the request')
    }
    return this.clientService.getTeamMemberById(outletId,clientId);
  }
  

  @Post('team')
  async createTeamMember(@Body() createClientDto: CreateClientDto, @ClientIdDecorator() clientIdDto: ClientIdDto) {
    console.log('create seller called ');
    return this.clientService.createTeamMember(createClientDto,clientIdDto);
  }
}
