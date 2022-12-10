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
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import type { TeamMembershipRequest } from '@teams/requests/team-membership-request.entity';
import { Team } from '@teams/team.entity';
import { User } from '@uaa/users/user.entity';
import { InviteMemberDto } from './dto/invite-member.dto';
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
  public async findAllMembers(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationOptions,
  ): Promise<PaginatedNodes<TeamMember>> {
    return await this.membersService.findAllMembers(id, query);
  }

  @Patch(':teamId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
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
