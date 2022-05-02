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
import { MembersService } from './members.service';
import type { TeamMember } from './team-member.entity';

@ApiTags('Teams Members')
@Controller()
export class MembersController {
  constructor(
    private readonly membersService: MembersService,
  ) {}

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  @SerializerTeamMemberIncludeTeam()
  public async findAllUsersInTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.membersService.findAllUsersInTeam(teamId, normalizePagination(query));
  }

  @Post(':userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerTeamMemberIncludeTeam()
  public async inviteUserToTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<TeamMembershipRequest> {
    return await this.membersService.inviteUserToTeam(requester, teamId, userId);
  }

  @Patch(':userId')
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

  @Delete(':userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  @SerializerIncludeTeamMembers()
  public async removeUserFromTeam(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<void> {
    await this.membersService.removeUserFromTeam(requester, teamId, userId);
  }
}
