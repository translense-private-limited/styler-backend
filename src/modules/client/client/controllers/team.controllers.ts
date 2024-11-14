import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ClientService } from "../services/client.service";
import { CreateClientDto } from "../dtos/client.dto";
import { ClientIdDecorator } from "@src/utils/decorators/client-id.decorator";
import { ClientIdDto } from "@src/utils/dtos/client-id.dto";

@Controller('client')
@ApiTags('Client/teams')
export class TeamControllers{

    constructor(
        private clientService:ClientService
    ){}

    @ApiBearerAuth('jwt')
    @Get('teams/:outletId') 
    async getAllTeamMembersForOutlet(@Param('outletId',ParseIntPipe) outletId: number) {
      return this.clientService.getAllTeamMembersForOutlet(outletId);
    }

    @Get(':clientId/outlet/:outletId')
    async getTeamMemeberById(
        @Param('clientId',ParseIntPipe) clientId:number,
        @Param('outletId',ParseIntPipe) outletId:number
    ){
        return this.clientService.getTeamByIdOrThrow(outletId,clientId);
    }

    @Post('team')
    async createTeamMember(@Body() createClientDto: CreateClientDto, @ClientIdDecorator() clientIdDto: ClientIdDto) {
        console.log('create seller called ');
        return this.clientService.createTeamMember(createClientDto,clientIdDto);
    }
}