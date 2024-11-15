import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ClientService } from '../services/client.service';
import { CreateClientDto } from '../dtos/client.dto';
import { ClientIdDecorator } from '@src/utils/decorators/client-id.decorator';
import { ClientIdDto } from '@src/utils/dtos/client-id.dto';
import { TeamMember } from '../dtos/team-member.dto';

@Controller('client')
@ApiTags('Client/teams')
export class TeamController {
  constructor(private clientService: ClientService) {}

  @ApiBearerAuth('jwt')
  @Get('teams/:outletId')
  async getAllTeamMembersForOutlet(
    @Param('outletId', ParseIntPipe) outletId: number,
  ): Promise<TeamMember[]> {
    return this.clientService.getAllTeamMembersForOutlet(outletId);
  }

  @ApiBearerAuth('jwt')
  @Get(':clientId')
  async getTeamMemberById(
    @Param('clientId', ParseIntPipe) clientId: number,
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
}
