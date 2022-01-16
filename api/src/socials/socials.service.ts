import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Club } from '../clubs/entities/club.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assertPermission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
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
  // eslint-disable-next-line max-params
  constructor(
    /* eslint-disable max-len */
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    @InjectRepository(User) private readonly usersRepository: BaseRepository<User>,
    @InjectRepository(Club) private readonly clubsRepository: BaseRepository<Club>,
    @InjectRepository(UserSocialAccount) private readonly userSocialsAccountRepository: BaseRepository<UserSocialAccount>,
    @InjectRepository(ClubSocialAccount) private readonly clubSocialsAccountRepository: BaseRepository<ClubSocialAccount>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    /* eslint-enable max-len */
  ) {}

  public async create(createSocialDto: CreateSocialDto): Promise<Social> {
    const social = new Social(createSocialDto);
    await this.socialsRepository.persistAndFlush(social);
    return social;
  }

  public async findAll(): Promise<Social[]> {
    return await this.socialsRepository.findAll();
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
    user: User,
    userId: string,
    socialId: number,
    createSocialAccountDto: CreateSocialAccountDto,
  ): Promise<UserSocialAccount> {
    // TODO: Move this to CASL
    if (user.userId !== userId)
      throw new ForbiddenException('Not the user');

    const social = await this.socialsRepository.findOneOrFail({ socialId });
    const socialAccount = new UserSocialAccount({ ...createSocialAccountDto, user, social });
    await this.userSocialsAccountRepository.persistAndFlush(socialAccount);
    return socialAccount;
  }

  public async findAllUserSocialAccounts(userId: string): Promise<UserSocialAccount[]> {
    return await this.userSocialsAccountRepository.find({ user: { userId } }, ['social', 'user']);
  }

  public async updateUserSocialAccount(
    requester: User,
    socialAccountId: number,
    updateSocialDto: UpdateSocialAccountDto,
  ): Promise<UserSocialAccount> {
    const userSocial = await this.userSocialsAccountRepository.findOneOrFail({ socialAccountId }, ['social', 'user']);

    const ability = this.caslAbilityFactory.createForUser(requester);
    assertPermissions(ability, Action.Update, userSocial.user);

    wrap(userSocial).assign(updateSocialDto);
    await this.userSocialsAccountRepository.flush();
    return userSocial;
  }

  public async deleteUserSocialAccount(requester: User, socialAccountId: number): Promise<void> {
    const userSocial = await this.userSocialsAccountRepository.findOneOrFail({ socialAccountId }, ['user']);

    const ability = this.caslAbilityFactory.createForUser(requester);
    assertPermissions(ability, Action.Update, userSocial.user);

    await this.userSocialsAccountRepository.removeAndFlush(userSocial);
  }

  public async addClubSocialAccount(
    requester: User,
    clubId: number,
    socialId: number,
    createSocialAccountDto: CreateSocialAccountDto,
  ): Promise<ClubSocialAccount> {
    const club = await this.clubsRepository.findOneOrFail({ clubId }, ['members']);
    // TODO: Move this to CASL
    if (!club.isClubAdmin(requester))
      throw new ForbiddenException('Not a club admin');

    const social = await this.socialsRepository.findOneOrFail({ socialId });
    const socialAccount = new ClubSocialAccount({ club, ...createSocialAccountDto, social });
    await this.clubSocialsAccountRepository.persistAndFlush(socialAccount);
    return socialAccount;
  }

  public async findAllClubSocialAccounts(clubId: number): Promise<ClubSocialAccount[]> {
    return await this.clubSocialsAccountRepository.find({ club: { clubId } }, ['social', 'club', 'club.members']);
  }

  public async updateClubSocialAccount(
    requester: User,
    socialAccountId: number,
    updateSocialDto: UpdateSocialAccountDto,
  ): Promise<ClubSocialAccount> {
    const clubSocial = await this.clubSocialsAccountRepository.findOneOrFail({ socialAccountId }, ['social', 'club', 'club.members']);
    // TODO: Move this to CASL
    if (!clubSocial.club.isClubAdmin(requester))
      throw new ForbiddenException('Not a club admin');

    wrap(clubSocial).assign(updateSocialDto);
    await this.clubSocialsAccountRepository.flush();
    return clubSocial;
  }

  public async deleteClubSocialAccount(requester: User, socialAccountId: number): Promise<void> {
    const clubSocial = await this.clubSocialsAccountRepository.findOneOrFail({ socialAccountId }, ['club', 'club.members']);
    // TODO: Move this to CASL
    if (!clubSocial.club.isClubAdmin(requester))
      throw new ForbiddenException('Not a club admin');

    await this.clubSocialsAccountRepository.removeAndFlush(clubSocial);
  }
}
