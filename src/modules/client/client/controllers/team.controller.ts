import {
  Body,
  Controller,
  Delete,
  Get,
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
import { TeamMember } from '../dtos/team-member.dto';
import { UpdateClientDto } from '../dtos/update-client.dto';

@Controller('client')
@ApiTags('Client/teams')
export class TeamController {
  constructor(private clientService: ClientService) {}

  @ApiBearerAuth('jwt')
  @Get('teams/outlet/:outletId')
  async getAllTeamMembersForOutlet(
    @Param('outletId', ParseIntPipe) outletId: number,
  ): Promise<TeamMember[]> {
    return this.clientService.getAllTeamMembersForOutlet(outletId);
  }

  @ApiBearerAuth('jwt')
  @Get('team/:teamMemberId')
  async getTeamMemberById(
    @Param('teamMemberId', ParseIntPipe) clientId: number,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<TeamMember> {
    return this.clientService.getTeamMemberById(clientId, clientIdDto);
  }

  @ApiBearerAuth('jwt')
  @Post('team')
  async createTeamMember(
    @Body() createClientDto: CreateClientDto,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<TeamMember> {
    return this.clientService.createTeamMember(createClientDto, clientIdDto);
  }

  @ApiBearerAuth('jwt')
  @Patch('team/:teamMemberId')
  async updateTeamMember(
    @Body() updateClientDto:UpdateClientDto,
    @ClientIdDecorator() clientIdDto:ClientIdDto,
    @Param('teamMemberId',ParseIntPipe) clientId:number
  ):Promise<TeamMember>{
    return this.clientService.updateTeamMember(updateClientDto,clientIdDto,clientId)
  }

  @ApiBearerAuth('jwt')
  @Delete('team/:teamMemberId')
  async deleteTeamMember(
    @Param('teamMemberId', ParseIntPipe) teamMemberId: number,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<void> {
    await this.clientService.deleteTeamMember(teamMemberId, clientIdDto);
  }

  @Delete('teams/outlet/:outletId')
  async deleteAllTeamMembers(
    @ClientIdDecorator() clientIdDto: ClientIdDto,
    @Param('outletId', ParseIntPipe) outletId: number,
  ): Promise<void> {
    await this.clientService.deleteAllTeamMembersForOutlet(outletId,clientIdDto);
  }

}
