import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/lib/decorators/current-user.decorator';
import { SerializerIncludeTeamMembers, SerializerTeamMemberIncludeTeam } from '../../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import type { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { Team } from '../teams/team.entity';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMembersService } from './members.service';
import type { TeamMember } from './team-member.entity';

@ApiTags('Team Members')
@Controller()
export class TeamMembersController {
  constructor(
    private readonly membersService: TeamMembersService,
  ) {}

  @Post(':teamId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerTeamMemberIncludeTeam()
  public async inviteUser(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<TeamMembershipRequest> {
    return await this.membersService.inviteUser(requester, teamId, userId);
  }

  @Get(':teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerTeamMemberIncludeTeam()
  public async findAllMembers(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.membersService.findAllMembers(teamId, normalizePagination(query));
  }

  @Patch(':teamId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerTeamMemberIncludeTeam()
  public async updateMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @Body() updateTeamMemberDto: UpdateTeamMemberDto,
    @CurrentUser() requester: User,
  ): Promise<TeamMember> {
    return await this.membersService.updateMember(requester, teamId, userId, updateTeamMemberDto);
  }

  @Delete(':teamId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerIncludeTeamMembers()
  public async removeMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<void> {
    await this.membersService.removeMember(requester, teamId, userId);
  }
}
