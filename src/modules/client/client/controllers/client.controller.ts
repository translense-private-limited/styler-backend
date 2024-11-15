// import { Body, Controller, Get, Post,Param, ParseIntPipe } from '@nestjs/common';
// import { ClientService } from '../services/client.service';
// import { CreateClientDto } from '../dtos/client.dto';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
// import { ClientIdDto } from '@src/utils/dtos/client-id.dto';

// @Controller('client')
// @ApiTags('Client')
// export class ClientController {
//   constructor(private readonly clientService: ClientService) {}

//   @ApiBearerAuth('jwt')
//   @Get('teams/:outletId') 
//   async getAllTeamMembersForOutlet(@Param('outletId',ParseIntPipe) outletId: number) {
//     return this.clientService.getAllTeamMembersForOutlet(outletId);
//   }

//   @Get(':clientId/outlet/:outletId')
//   async getClienById(
//     @Param('  clientId',ParseIntPipe) clientId:number,
//     @Param('outletId',ParseIntPipe) outletId:number
//   ){
//     return this.clientService.getTeamByIdOrThrow(outletId,clientId);
//   }
  

//   @Post('team')
//   async createClient(@Body() createClientDto: CreateClientDto, @ClientIdDecorator() clientIdDto: ClientIdDto) {
//     console.log('create seller called ');
//     return this.clientService.createTeamMember(createClientDto,clientIdDto);
//   }
// }
