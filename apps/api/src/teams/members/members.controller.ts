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
// Import { SerializerIncludeTeamForm, SerializerTeamMemberIncludeTeam }
// from '../../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../../shared/modules/pagination';
import type { PaginatedResult } from '../../shared/modules/pagination';
import { User } from '../../users/user.entity';
import type { TeamMembershipRequest } from '../requests/team-membership-request.entity';
import { Team } from '../teams/team.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateTeamMemberDto } from './dto/update-team-member.dto';
import { TeamMembersService } from './members.service';
import type { TeamMember } from './team-member.entity';

@ApiTags('Team Members')
@Controller()
// @SerializerIncludeTeamForm()
export class TeamMembersController {
  constructor(
    private readonly membersService: TeamMembersService,
  ) {}

  @Post(':teamId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  public async inviteUser(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @Body() inviteMemberDto: InviteMemberDto,
    @CurrentUser() requester: User,
  ): Promise<TeamMembershipRequest> {
    return await this.membersService.inviteUser(requester, teamId, userId, inviteMemberDto);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  // @SerializerTeamMemberIncludeTeam()
  public async findAllMembers(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<TeamMember>> {
    return await this.membersService.findAllMembers(id, normalizePagination(query));
  }

  @Patch(':teamId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  // @SerializerTeamMemberIncludeTeam()
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
  public async removeMember(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<void> {
    await this.membersService.removeMember(requester, teamId, userId);
  }
}
