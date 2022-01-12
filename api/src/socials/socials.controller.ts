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
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { PaginateDto } from '../shared/modules/pagination/paginate.dto';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { CreateSocialAccountDto } from './dto/create-social-account.dto';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialAccountDto } from './dto/update-social-account.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import type { ClubSocialAccount } from './entities/club-social-account.entity';
import { Social } from './entities/social.entity';
import type { UserSocialAccount } from './entities/user-social-account.entity';
import { SocialsService } from './socials.service';

@ApiTags('Socials')
@Controller({ path: 'socials' })
export class SocialsController {
  constructor(
    private readonly socialsService: SocialsService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Social))
  public async create(@Body() createSocialDto: CreateSocialDto): Promise<Social> {
    return await this.socialsService.create(createSocialDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Social))
  public async findAll(@Query() query: PaginateDto): Promise<PaginatedResult<Social>> {
    if (query.page)
      return await this.socialsService.findAll({ page: query.page, itemsPerPage: query.itemsPerPage ?? 10 });
    return await this.socialsService.findAll();
  }

  @Post('/user/:userId/:socialId')
  public async addUserSocialAccount(
    @Param('userId') userId: string,
    @Param('socialId', ParseIntPipe) socialId: number,
    @Body() createSocialAccountDto: CreateSocialAccountDto,
  ): Promise<UserSocialAccount> {
    return await this.socialsService.addUserSocialAccount(userId, socialId, createSocialAccountDto);
  }

  @Get('/user/:userId')
  public async findAllUserSocialAccounts(
    @Param('userId') userId: string,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<UserSocialAccount>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.socialsService.findAllUserSocialAccounts(userId, options);
    }
    return await this.socialsService.findAllUserSocialAccounts(userId);
  }

  @Post('/club/:clubId/:socialId')
  public async addClubSocial(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('socialId', ParseIntPipe) socialId: number,
    @Body() createSocialAccountDto: CreateSocialAccountDto,
  ): Promise<ClubSocialAccount> {
    return await this.socialsService.addClubSocialAccount(clubId, socialId, createSocialAccountDto);
  }

  @Get('/club/:clubId')
  public async findAllClubSocialAccounts(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Query() query: PaginateDto,
  ): Promise<PaginatedResult<ClubSocialAccount>> {
    if (query.page) {
      const options = { page: query.page, itemsPerPage: query.itemsPerPage ?? 10 };
      return await this.socialsService.findAllClubSocialAccounts(clubId, options);
    }
    return await this.socialsService.findAllClubSocialAccounts(clubId);
  }

  @Patch('/account/:socialAccountId')
  public async updateUserSocialAccount(
    @Param('socialAccountId', ParseIntPipe) socialAccountId: number,
    @Body() updateSocialAccountDto: UpdateSocialAccountDto,
  ): Promise<UserSocialAccount > {
    return await this.socialsService.updateSocialAccount(socialAccountId, updateSocialAccountDto);
  }

  @Delete('/account/:socialAccountId')
  public async deleteSocialAccount(
    @Param('socialAccountId', ParseIntPipe) socialAccountId: number,
  ): Promise<void> {
    await this.socialsService.deleteSocialAccount(socialAccountId);
  }

  @Get(':socialId')
  @CheckPolicies(ability => ability.can(Action.Read, Social))
  public async findOne(@Param('socialId', ParseIntPipe) socialId: number): Promise<Social | null> {
    return await this.socialsService.findOne(socialId);
  }

  @Patch(':socialId')
  @CheckPolicies(ability => ability.can(Action.Update, Social))
  public async update(
    @Param('socialId', ParseIntPipe) socialId: number,
    @Body() updateSocialDto: UpdateSocialDto,
  ): Promise<Social> {
    return await this.socialsService.update(socialId, updateSocialDto);
  }

  @Delete(':socialId')
  @CheckPolicies(ability => ability.can(Action.Delete, Social))
  public async remove(@Param('socialId', ParseIntPipe) socialId: number): Promise<void> {
    await this.socialsService.remove(socialId);
  }
}
