import { Body, Controller, Get, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { ClientService } from "../services/client.service";
import { CreateClientDto } from "../dtos/client.dto";
import { ClientIdDecorator } from "@src/utils/decorators/client-id.decorator";
import { ClientIdDto } from "@src/utils/dtos/client-id.dto";
import { ClientEntity } from "../entities/client.entity";
import { TeamMembers } from "../dtos/teamMembers.dto";

@Controller('client')
@ApiTags('Client/teams')
export class TeamController{

    constructor(
        private clientService:ClientService
    ){}

    @ApiBearerAuth('jwt')
    @Get('teams/:outletId') 
    async getAllTeamMembersForOutlet(@Param('outletId',ParseIntPipe) outletId: number):Promise<ClientEntity[]> {
      return this.clientService.getAllTeamMembersForOutlet(outletId);
    }

    @Get(':clientId')
    async getTeamMemeberById(
        @Param('clientId',ParseIntPipe) clientId:number,
        @ClientIdDecorator() clientIdDto:ClientIdDto

    ):Promise<ClientEntity>{
        return this.clientService.getTeamByIdOrThrow(clientId,clientIdDto);
    }

    @Post('team')
    async createTeamMember(@Body() createClientDto: CreateClientDto, @ClientIdDecorator() clientIdDto: ClientIdDto):Promise<TeamMembers> {
        return this.clientService.createTeamMember(createClientDto,clientIdDto);
    }
}