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
import { TypesenseGuard } from '../shared/lib/guards/typesense.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../shared/modules/search/search.dto';
import { UsersService } from '../users/users.service';
import type { ClubMember } from './club-member.entity';
import { ClubSearchService } from './club-search.service';
import type { IndexedClub } from './club-search.service';
import { Club } from './club.entity';
import { ClubsService } from './clubs.service';
import { CreateClubMemberDto } from './dto/create-club-member.dto';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubMemberDto } from './dto/update-club-member.dto';
import { UpdateClubDto } from './dto/update-club.dto';

@ApiTags('Clubs')
@Controller({ path: 'clubs' })
export class ClubsController {
  constructor(
    private readonly clubsService: ClubsService,
    private readonly userService: UsersService,
    private readonly clubSearchService: ClubSearchService,
) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Club))
  public async create(@Body() createTagDto: CreateClubDto): Promise<Club> {
    return await this.clubsService.create(createTagDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Club))
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
  public async findClubMemberships(@Param('userId') userId: string): Promise<ClubMember[]> {
    const user = await this.userService.findOneById(userId);
    return this.clubsService.findClubMembership(user);
  }

  @Get(':clubId/members')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
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
  @CheckPolicies(ability => ability.can(Action.Create, Club))
  public async addUserToClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId') userId: string,
    @Body() createClubMemberDto: CreateClubMemberDto,
  ): Promise<ClubMember> {
    return await this.clubsService.addUserToClub(clubId, userId, createClubMemberDto);
  }

  @Patch(':clubId/members/:userId')
  public async updateUserRole(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId') userId: string,
    @Body() updateClubMemberDto: UpdateClubMemberDto,
  ): Promise<ClubMember> {
    return await this.clubsService.updateUserRole(clubId, userId, updateClubMemberDto);
  }

  @Delete(':clubId/members/:userId')
  public async removeUserFromClub(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('userId') userId: string,
  ): Promise<void> {
    const user = await this.userService.findOneById(userId);
    await this.clubsService.removeUserFromClub(clubId, user);
  }

  @Get(':clubId')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  public async findOne(@Param('clubId', ParseIntPipe) clubId: number): Promise<Club> {
    return await this.clubsService.findOne(clubId);
  }

  @Patch(':clubId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  public async update(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() updateSubjectDto: UpdateClubDto,
  ): Promise<Club> {
    return await this.clubsService.update(clubId, updateSubjectDto);
  }

  @Delete(':clubId')
  @CheckPolicies(ability => ability.can(Action.Delete, Club))
  public async remove(@Param('clubId', ParseIntPipe) clubId: number): Promise<void> {
    await this.clubsService.remove(clubId);
  }
}
