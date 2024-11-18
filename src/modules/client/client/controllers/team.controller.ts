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
import { TeamMember } from '../dtos/team-member.dto';
import { TeamMemberService } from '../services/team-member.service';

@Controller('client')
@ApiTags('Client/teams')
export class TeamController {
  constructor(
    private clientService: ClientService,
    private teamMemberService: TeamMemberService,
  ) {}

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
    @Param('teamMemberId', ParseIntPipe) teamMemberId: number,
    @Body() updateTeamMemberDto: Partial<TeamMember>,
  ): Promise<TeamMember> {
    return await this.teamMemberService.updateTeamMember(
      teamMemberId,
      updateTeamMemberDto,
    );
  }

  @ApiBearerAuth('jwt')
  @Delete('team/:teamMemberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTeamMember(
    @Param('teamMemberId', ParseIntPipe) teamMemberId: number,
    @ClientIdDecorator() clientIdDto: ClientIdDto,
  ): Promise<String> {
    await this.teamMemberService.deleteTeamMember(teamMemberId, clientIdDto);
    return;
  }
}
