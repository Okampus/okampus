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
import { Class } from '@classes/class.entity';
import { CreateClassMembershipDto } from '@classes/memberships/dto/create-class-membership.dto';
import { Action, CheckPolicies } from '@common/modules/authorization';
import { PaginationOptions } from '@common/modules/pagination';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CurrentUser } from '@lib/decorators/current-user.decorator';
import { User } from '@uaa/users/user.entity';
import type { ClassMembership } from './class-membership.entity';
import { UpdateClassMembershipDto } from './dto/update-class-membership.dto';
import { ClassMembershipsService } from './memberships.service';

@ApiTags('Class Members')
@Controller()
export class ClassMembershipsController {
  constructor(
    private readonly classMembershipsService: ClassMembershipsService,
  ) {}

  @Get('all')
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findAllMembers(@Query() query: PaginationOptions): Promise<PaginatedNodes<ClassMembership>> {
    return await this.classMembershipsService.findAllMembers(query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Class))
  public async findMembers(
    @Param('id') id: string,
    @Query() query: PaginationOptions,
  ): Promise<PaginatedNodes<ClassMembership>> {
    return await this.classMembershipsService.findMembers(id, query);
  }

  @Post(':classId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async addMember(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
    @Body() createClassMembershipDto: CreateClassMembershipDto,
    @CurrentUser() requester: User,
  ): Promise<ClassMembership> {
    return await this.classMembershipsService
      .giveMembership(requester, classId, userId, createClassMembershipDto);
  }

  @Patch(':classId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async updateMember(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
    @Body() updateClassMembershipDto: UpdateClassMembershipDto,
    @CurrentUser() requester: User,
  ): Promise<ClassMembership> {
    return await this.classMembershipsService
      .updateMembership(requester, classId, userId, updateClassMembershipDto);
  }

  @Delete(':classId/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Class))
  public async removeMember(
    @Param('classId') classId: string,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<ClassMembership> {
    return await this.classMembershipsService.removeMembership(requester, classId, userId);
  }
}
