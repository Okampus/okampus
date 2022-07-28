import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/orm/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { AdminTeamContactUpdatedNotification } from '../shared/modules/notifications/notifications';
import { NotificationsService } from '../shared/modules/notifications/notifications.service';
import { Team } from '../teams/teams/team.entity';
import type { User } from '../users/user.entity';
import type { CreateContactAccountDto } from './dto/create-contact-account.dto';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactAccountDto } from './dto/update-contact-account.dto';
import type { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import { TeamContactAccount } from './entities/team-contact-account.entity';
import { UserContactAccount } from './entities/user-contact-account.entity';

@Injectable()
export class ContactsService {
  // eslint-disable-next-line max-params
  constructor(
    /* eslint-disable max-len */
    @InjectRepository(Contact) private readonly contactsRepository: BaseRepository<Contact>,
    @InjectRepository(Team) private readonly teamsRepository: BaseRepository<Team>,
    @InjectRepository(UserContactAccount) private readonly userContactsAccountRepository: BaseRepository<UserContactAccount>,
    @InjectRepository(TeamContactAccount) private readonly teamContactsAccountRepository: BaseRepository<TeamContactAccount>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
    private readonly notificationsService: NotificationsService,
    /* eslint-enable max-len */
  ) {}

  public async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = new Contact(createContactDto);
    await this.contactsRepository.persistAndFlush(contact);
    return contact;
  }

  public async findAll(): Promise<Contact[]> {
    return await this.contactsRepository.findAll();
  }

  public async findOne(id: number): Promise<Contact> {
    return await this.contactsRepository.findOneOrFail({ id });
  }

  public async update(id: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactsRepository.findOneOrFail({ id });

    wrap(contact).assign(updateContactDto);
    await this.contactsRepository.flush();
    return contact;
  }

  public async remove(id: number): Promise<void> {
    const contact = await this.contactsRepository.findOneOrFail({ id });
    await this.contactsRepository.removeAndFlush(contact);
  }

  public async addUserContactAccount(
    user: User,
    createContactAccountDto: CreateContactAccountDto,
  ): Promise<UserContactAccount> {
    const contact = await this.contactsRepository.findOneOrFail({ id: createContactAccountDto.id });
    const contactAccount = new UserContactAccount({ ...createContactAccountDto, user, contact });
    await this.userContactsAccountRepository.persistAndFlush(contactAccount);
    return contactAccount;
  }

  public async findAllUserContactAccounts(id: string): Promise<UserContactAccount[]> {
    return await this.userContactsAccountRepository.find({ user: { id } }, { populate: ['contact', 'user'] });
  }

  public async updateUserContactAccount(
    user: User,
    id: number,
    updateContactDto: UpdateContactAccountDto,
  ): Promise<UserContactAccount> {
    const userContact = await this.userContactsAccountRepository.findOneOrFail(
      { id },
      { populate: ['contact', 'user'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, userContact.user);

    wrap(userContact).assign(updateContactDto);
    await this.userContactsAccountRepository.flush();
    return userContact;
  }

  public async deleteUserContactAccount(user: User, id: number): Promise<void> {
    const userContact = await this.userContactsAccountRepository.findOneOrFail(
      { id },
      { populate: ['user'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, userContact.user);

    await this.userContactsAccountRepository.removeAndFlush(userContact);
  }

  public async addTeamContactAccount(
    requester: User,
    id: number,
    createContactAccountDto: CreateContactAccountDto,
  ): Promise<TeamContactAccount> {
    const team = await this.teamsRepository.findOneOrFail({ id }, { populate: ['members'] });
    // TODO: Move this to CASL
    if (!team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    const contact = await this.contactsRepository.findOneOrFail({ id: createContactAccountDto.id });
    const contactAccount = new TeamContactAccount({ team, ...createContactAccountDto, contact });
    await this.teamContactsAccountRepository.persistAndFlush(contactAccount);

    void this.notificationsService.trigger(
      new AdminTeamContactUpdatedNotification(contactAccount, { executor: requester }),
    );

    return contactAccount;
  }

  public async findAllTeamContactAccounts(id: number): Promise<TeamContactAccount[]> {
    return await this.teamContactsAccountRepository.find(
      { team: { id } },
      { populate: ['contact', 'team'] },
    );
  }

  public async updateTeamContactAccount(
    requester: User,
    id: number,
    updateContactDto: UpdateContactAccountDto,
  ): Promise<TeamContactAccount> {
    const teamContact = await this.teamContactsAccountRepository.findOneOrFail(
      { id },
      { populate: ['contact', 'team', 'team.members'] },
    );
    // TODO: Move this to CASL
    if (!teamContact.team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    const previous = { previousLink: teamContact.link, previousPseudo: teamContact.pseudo };

    wrap(teamContact).assign(updateContactDto);
    await this.teamContactsAccountRepository.flush();

    void this.notificationsService.trigger(
      new AdminTeamContactUpdatedNotification(teamContact, { ...previous, executor: requester }),
    );

    return teamContact;
  }

  public async deleteTeamContactAccount(requester: User, id: number): Promise<void> {
    const teamContact = await this.teamContactsAccountRepository.findOneOrFail(
      { id },
      { populate: ['team', 'team.members'] },
    );
    // TODO: Move this to CASL
    if (!teamContact.team.canAdminister(requester))
      throw new ForbiddenException('Not a team admin');

    const previous = { previousLink: teamContact.link, previousPseudo: teamContact.pseudo };

    await this.teamContactsAccountRepository.removeAndFlush(teamContact);

    void this.notificationsService.trigger(
      new AdminTeamContactUpdatedNotification(teamContact, { ...previous, executor: requester }),
    );
  }
}
