import {
 Controller, Get, Param, Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { SearchResponse } from 'typesense/lib/Typesense/Documents';
import { TypesenseError } from 'typesense/lib/Typesense/Errors';
import { SearchDto } from '../shared/modules/search/search.dto';
import { UserSearchService } from './user-search.service';
import type { IndexedUser } from './user-search.service';
import type { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userSearchService: UserSearchService,
  ) {}

  @Get(':username')
  public async findOne(@Param('username') username: string): Promise<User> {
    return await this.usersService.findOne(username);
  }

  @Get('/search')
  public async search(
    @Query('full') full: boolean,
    @Query() query: SearchDto,
  ): Promise<SearchResponse<IndexedUser> | SearchResponse<User>> {
    try {
      if (full)
        return await this.userSearchService.searchAndPopulate(query);
      return await this.userSearchService.search(query);
    } catch (error: unknown) {
      if (error instanceof TypesenseError)
        this.userSearchService.throwHttpExceptionFromTypesenseError(error);
      throw error;
    }
  }
}
