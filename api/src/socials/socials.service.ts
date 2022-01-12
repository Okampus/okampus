import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Club } from '../clubs/club.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import type { PaginationOptions } from '../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../shared/modules/pagination/pagination.interface';
import { User } from '../users/user.entity';
import type { CreateSocialAccountDto } from './dto/create-social-account.dto';
import type { CreateSocialDto } from './dto/create-social.dto';
import type { UpdateSocialAccountDto } from './dto/update-social-account.dto';
import type { UpdateSocialDto } from './dto/update-social.dto';
import { ClubSocialAccount } from './entities/club-social-account.entity';
import { Social } from './entities/social.entity';
import { UserSocialAccount } from './entities/user-social-account.entity';

@Injectable()
export class SocialsService {
  constructor(
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    @InjectRepository(User) private readonly usersRepository: BaseRepository<User>,
    @InjectRepository(Club) private readonly clubsRepository: BaseRepository<Club>,
    @InjectRepository(UserSocialAccount)
    private readonly userSocialsAccountRepository: BaseRepository<UserSocialAccount>,
    @InjectRepository(ClubSocialAccount)
    private readonly clubSocialsAccountRepository: BaseRepository<ClubSocialAccount>,
  ) {}

  public async create(createSocialDto: CreateSocialDto): Promise<Social> {
    const social = new Social(createSocialDto);
    await this.socialsRepository.persistAndFlush(social);
    return social;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<Social>> {
    return await this.socialsRepository.findWithPagination(paginationOptions);
  }

  public async findOne(socialId: number): Promise<Social> {
    return await this.socialsRepository.findOneOrFail({ socialId });
  }

  public async update(socialId: number, updateSocialDto: UpdateSocialDto): Promise<Social> {
    const social = await this.socialsRepository.findOneOrFail({ socialId });

    wrap(social).assign(updateSocialDto);
    await this.socialsRepository.flush();
    return social;
  }

  public async remove(socialId: number): Promise<void> {
    const social = await this.socialsRepository.findOneOrFail({ socialId });
    await this.socialsRepository.removeAndFlush(social);
  }

  public async addUserSocialAccount(
    userId: string,
    socialId: number,
    createSocialAccountDto: CreateSocialAccountDto,
  ): Promise<UserSocialAccount> {
    const social = await this.socialsRepository.findOneOrFail({ socialId });
    const user = await this.usersRepository.findOneOrFail({ userId });
    const socialAccount = new UserSocialAccount({ ...createSocialAccountDto, user, social });
    await this.userSocialsAccountRepository.persistAndFlush(socialAccount);
    return socialAccount;
  }

  public async findAllUserSocialAccounts(
    userId: string,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<UserSocialAccount>> {
    const user = await this.usersRepository.findOneOrFail({ userId });
    return await this.userSocialsAccountRepository.findWithPagination(paginationOptions, { user });
  }

  public async addClubSocialAccount(
    clubId: number,
    socialId: number,
    createSocialAccountDto: CreateSocialAccountDto,
  ): Promise<ClubSocialAccount> {
    const club = await this.clubsRepository.findOneOrFail({ clubId });
    const social = await this.socialsRepository.findOneOrFail({ socialId });
    const socialAccount = new ClubSocialAccount({ club, ...createSocialAccountDto, social });
    await this.clubSocialsAccountRepository.persistAndFlush(socialAccount);
    return socialAccount;
  }

  public async findAllClubSocialAccounts(
    clubId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<ClubSocialAccount>> {
    const club = await this.clubsRepository.findOneOrFail({ clubId });
    return await this.clubSocialsAccountRepository.findWithPagination(paginationOptions, { club });
  }

  public async updateSocialAccount(
    socialAccountId: number,
    updateSocialDto: UpdateSocialAccountDto,
  ): Promise<UserSocialAccount> {
    const social = await this.userSocialsAccountRepository.findOneOrFail({ socialAccountId });

    wrap(social).assign(updateSocialDto);
    await this.userSocialsAccountRepository.flush();
    return social;
  }

  public async deleteSocialAccount(socialAccountId: number): Promise<void> {
    const social = await this.userSocialsAccountRepository.findOneOrFail({ socialAccountId });
    await this.userSocialsAccountRepository.removeAndFlush(social);
  }
}
