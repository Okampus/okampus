import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Club } from '../clubs/entities/club.entity';
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { User } from '../users/user.entity';
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
  public async findAll(): Promise<Social[]> {
    return await this.socialsService.findAll();
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

  @Post('/user/:userId/:socialId')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async addUserSocialAccount(
    @Param('userId') userId: string,
    @Param('socialId', ParseIntPipe) socialId: number,
    @Body() createSocialAccountDto: CreateSocialAccountDto,
    @CurrentUser() requester: User,
  ): Promise<UserSocialAccount> {
    return await this.socialsService.addUserSocialAccount(requester, userId, socialId, createSocialAccountDto);
  }

  @Get('/user/:userId')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findAllUserSocialAccounts(@Param('userId') userId: string): Promise<UserSocialAccount[]> {
    return await this.socialsService.findAllUserSocialAccounts(userId);
  }

  @Patch('/user/:socialAccountId')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async updateUserSocialAccount(
    @Param('socialAccountId', ParseIntPipe) socialAccountId: number,
    @Body() updateSocialAccountDto: UpdateSocialAccountDto,
    @CurrentUser() user: User,
  ): Promise<UserSocialAccount> {
    return await this.socialsService.updateUserSocialAccount(user, socialAccountId, updateSocialAccountDto);
  }

  @Delete('/user/:socialAccountId')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async deleteUserSocialAccount(
    @Param('socialAccountId', ParseIntPipe) socialAccountId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.socialsService.deleteUserSocialAccount(user, socialAccountId);
  }

  @Post('/club/:clubId/:socialId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  public async addClubSocial(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Param('socialId', ParseIntPipe) socialId: number,
    @Body() createSocialAccountDto: CreateSocialAccountDto,
    @CurrentUser() user: User,
  ): Promise<ClubSocialAccount> {
    return await this.socialsService.addClubSocialAccount(user, clubId, socialId, createSocialAccountDto);
  }

  @Get('/club/:clubId')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  public async findAllClubSocialAccounts(@Param('clubId', ParseIntPipe) clubId: number): Promise<ClubSocialAccount[]> {
    return await this.socialsService.findAllClubSocialAccounts(clubId);
  }

  @Patch('/club/:socialAccountId')
  public async updateClubSocialAccount(
    @Param('socialAccountId', ParseIntPipe) socialAccountId: number,
    @Body() updateSocialAccountDto: UpdateSocialAccountDto,
    @CurrentUser() user: User,
  ): Promise<ClubSocialAccount> {
    return await this.socialsService.updateClubSocialAccount(user, socialAccountId, updateSocialAccountDto);
  }

  @Delete('/club/:socialAccountId')
  public async deleteClubSocialAccount(
    @Param('socialAccountId', ParseIntPipe) socialAccountId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.socialsService.deleteClubSocialAccount(user, socialAccountId);
  }
}
