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
import { CurrentUser } from '@meta/shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@meta/shared/modules/authorization';
import { normalizePagination, PaginateDto } from '@meta/shared/modules/pagination';
import type { PaginatedResult } from '@meta/shared/modules/pagination';
import { CreateClassMembershipDto } from '@modules/org/classes/memberships/dto/create-class-membership.dto';
import { User } from '@modules/uua/users/user.entity';
import { Class } from '../class.entity';
import type { ClassMembership } from './class-membership.entity';
import { UpdateClassMembershipDto } from './dto/update-class-membership.dto';
import { ClassMembershipsService } from './memberships.service';

@ApiTags('Class Members')
@Controller()
export class ClassMembershipsController {
  constructor(
    private readonly schoolGroupMembershipsService: ClassMembershipsService,
  ) {}

  @Get('all')
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findAllMembers(@Query() query: PaginateDto): Promise<PaginatedResult<ClassMembership>> {
    return await this.schoolGroupMembershipsService.findAllMembers(normalizePagination(query));
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findMembers(
    @Param('id') id: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<ClassMembership>> {
    return await this.schoolGroupMembershipsService.findMembers(id, normalizePagination(query));
  }

  @Post(':schoolGroupId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async addMember(
    @Param('schoolGroupId') schoolGroupId: string,
    @Param('userId') userId: string,
    @Body() createClassMembershipDto: CreateClassMembershipDto,
    @CurrentUser() requester: User,
  ): Promise<ClassMembership> {
    return await this.schoolGroupMembershipsService
      .giveMembership(requester, schoolGroupId, userId, createClassMembershipDto);
  }

  @Patch(':schoolGroupId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async updateMember(
    @Param('schoolGroupId') schoolGroupId: string,
    @Param('userId') userId: string,
    @Body() updateClassMembershipDto: UpdateClassMembershipDto,
    @CurrentUser() requester: User,
  ): Promise<ClassMembership> {
    return await this.schoolGroupMembershipsService
      .updateMembership(requester, schoolGroupId, userId, updateClassMembershipDto);
  }

  @Delete(':schoolGroupId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async removeMember(
    @Param('schoolGroupId') schoolGroupId: string,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<ClassMembership> {
    return await this.schoolGroupMembershipsService.removeMembership(requester, schoolGroupId, userId);
  }
}
