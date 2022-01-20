import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { TypesenseGuard } from '../shared/lib/guards/typesense.guard';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { SearchDto } from '../shared/modules/search/search.dto';
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

  @UseGuards(TypesenseGuard)
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
    if (query.page)
      return await this.usersService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.usersService.findAll();
  }

  @Patch('update')
  public async updateOne(@CurrentUser() user: User, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(user.userId, updateUserDto);
  }
}
