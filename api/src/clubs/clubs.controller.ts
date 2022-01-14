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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SerializerClubMemberIncludeClub, SerializerIncludeClubMembers } from '../shared/lib/decorators/serializers.decorator';
import { TypesenseGuard } from '../shared/lib/guards/typesense.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../shared/modules/search/search.dto';
import { User } from '../users/user.entity';
import { ClubSearchService } from './club-search.service';
import type { IndexedClub } from './club-search.service';
import { ClubsService } from './clubs.service';
import { CreateClubMemberDto } from './dto/create-club-member.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubMemberDto } from './dto/update-club-member.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import type { ClubMember } from './entities/club-member.entity';
import { Club } from './entities/club.entity';

@ApiTags('Clubs')
@Controller({ path: 'clubs' })
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly clubSearchService: ClubSearchService,
) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Club))
  @SerializerIncludeClubMembers()
  public async create(
    @Body() createTagDto: CreateClubDto,
    @CurrentUser() user: User,
  ): Promise<Club> {
    return await this.clubsService.create(user, createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  @SerializerIncludeClubMembers()
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Club>> {
    if (query.page)
      return await this.clubsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.clubsService.findAll();
  }

  @UseGuards(TypesenseGuard)
  @Get('/search')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<Club> | SearchResponse<IndexedClub>> {
    if (full)
      return await this.clubSearchService.searchAndPopulate(query);
    return await this.clubSearchService.search(query);
  }

  @Get('/member/:userId')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  @SerializerClubMemberIncludeClub()
  public async findClubMemberships(
    @Param('userId') userId: string,
  ): Promise<PaginatedResult<ClubMember>> {
    return this.clubsService.findClubMembership(userId);
  }

  @Get(':clubId/members')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  @SerializerClubMemberIncludeClub()
  public async findAllUsersInClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<ClubMember>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.clubsService.findAllUsersInClub(clubId, options);
    }
    return await this.clubsService.findAllUsersInClub(clubId);
  }

  @Post(':clubId/members/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  @SerializerClubMemberIncludeClub()
  public async addUserToClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId') userId: string,
    @Body() createClubMemberDto: CreateClubMemberDto,
    @CurrentUser() requester: User,
  ): Promise<ClubMember> {
    return await this.clubsService.addUserToClub(requester, clubId, userId, createClubMemberDto);
  }

  @Patch(':clubId/members/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  @SerializerClubMemberIncludeClub()
  public async updateUserRole(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId') userId: string,
    @Body() updateClubMemberDto: UpdateClubMemberDto,
    @CurrentUser() requester: User,
  ): Promise<ClubMember> {
    return await this.clubsService.updateUserRole(requester, clubId, userId, updateClubMemberDto);
  }

  @Delete(':clubId/members/:userId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  @SerializerIncludeClubMembers()
  public async removeUserFromClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId') userId: string,
    @CurrentUser() requester: User,
  ): Promise<void> {
    await this.clubsService.removeUserFromClub(requester, clubId, userId);
  }

  @Get(':clubId')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  @SerializerIncludeClubMembers()
  public async findOne(@Param('clubId', ParseIntPipe) clubId: number): Promise<Club> {
    return await this.clubsService.findOne(clubId);
  }

  @Patch(':clubId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  @SerializerIncludeClubMembers()
  public async update(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() updateSubjectDto: UpdateClubDto,
    @CurrentUser() requester: User,
  ): Promise<Club> {
    return await this.clubsService.update(requester, clubId, updateSubjectDto);
  }

  @Delete(':clubId')
  @CheckPolicies(ability => ability.can(Action.Delete, Club))
  @SerializerIncludeClubMembers()
  public async remove(@Param('clubId', ParseIntPipe) clubId: number): Promise<void> {
    await this.clubsService.remove(clubId);
  }
}
