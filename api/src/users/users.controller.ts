import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { TypesenseEnabledGuard } from '../shared/lib/guards/typesense-enabled.guard';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { normalizePagination, PaginateDto } from '../shared/modules/pagination';
import type { PaginatedResult } from '../shared/modules/pagination';
import { SearchDto } from '../shared/modules/search/search.dto';
import type { Statistics } from '../statistics/statistics.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserSearchService } from './user-search.service';
import type { IndexedUser } from './user-search.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSearchService: UserSearchService,
  ) {}

  @Get(':userId')
  public async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOneById(userId);
  }

  @UseGuards(TypesenseEnabledGuard)
  @Get('/search')
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedUser> | SearchResponse<User>> {
    if (full)
      return await this.userSearchService.searchAndPopulate(query);
    return await this.userSearchService.search(query);
  }

  @Get()
  public async async(@Query() query: PaginateDto): Promise<PaginatedResult<User>> {
    return await this.usersService.findAll(normalizePagination(query));
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, User))
  public async deleteUser(@Param('id') id: string): Promise<void> {
    await this.usersService.deleteUser(id);
  }

  @Get('/:userId/statistics')
  public async getUserStats(@Param('userId') userId: string): Promise<Statistics | null> {
    return await this.usersService.getUserStats(userId);
  }

  @Patch()
  public async updateOne(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateUser(user.userId, updateUserDto);
  }
}
