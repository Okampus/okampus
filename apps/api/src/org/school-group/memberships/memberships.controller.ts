import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../../../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../../../shared/modules/pagination';
import type { PaginatedResult } from '../../../shared/modules/pagination';
import { User } from '../../../uua/users/user.entity';
import { SchoolGroup } from '../school-group.entity';
import { CreateSchoolGroupMembershipDto } from './dto/create-school-group-membership.dto';
import { UpdateSchoolGroupMembershipDto } from './dto/update-school-group-membership.dto';
import { SchoolGroupMembershipsService } from './memberships.service';
import type { SchoolGroupMembership } from './school-group-membership.entity';

@ApiTags('SchoolGroup Members')
@Controller({ path: 'school-groups/memberships' })
export class SchoolGroupMembershipsController {
  constructor(
    private readonly schoolGroupMembershipsService: SchoolGroupMembershipsService,
  ) {}

  @Get('all')
  @CheckPolicies(ability => ability.can(Action.Read, SchoolGroup))
  public async findAllMembers(@Query() query: PaginateDto): Promise<PaginatedResult<SchoolGroupMembership>> {
    return await this.schoolGroupMembershipsService.findAllMembers(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, SchoolGroup))
  public async findMembers(
    @Param('id') id: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<SchoolGroupMembership>> {
    return await this.schoolGroupMembershipsService.findMembers(id, normalizePagination(query));
  }

  @Post(':schoolGroupId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, SchoolGroup))
  public async addMember(
    @Param('schoolGroupId') schoolGroupId: string,
    @Param('userId') userId: string,
    @Body() createSchoolGroupMembershipDto: CreateSchoolGroupMembershipDto,
    @CurrentUser() requester: User,
  ): Promise<SchoolGroupMembership> {
    return await this.schoolGroupMembershipsService
      .giveMembership(requester, schoolGroupId, userId, createSchoolGroupMembershipDto);
  }

  @Patch(':schoolGroupId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, SchoolGroup))
  public async updateMember(
    @Param('schoolGroupId') schoolGroupId: string,
    @Param('userId') userId: string,
    @Body() updateSchoolGroupMembershipDto: UpdateSchoolGroupMembershipDto,
    @CurrentUser() requester: User,
  ): Promise<SchoolGroupMembership> {
    return await this.schoolGroupMembershipsService
      .updateMembership(requester, schoolGroupId, userId, updateSchoolGroupMembershipDto);
  }

  @Delete(':schoolGroupId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, SchoolGroup))
  public async removeMember(
    @Param('schoolGroupId') schoolGroupId: string,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<SchoolGroupMembership> {
    return await this.schoolGroupMembershipsService.removeMembership(requester, schoolGroupId, userId);
  }
}
