import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { Team } from '../teams/entities/team.entity';
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
  constructor(
    /* eslint-disable max-len */
    @InjectRepository(Contact) private readonly contactsRepository: BaseRepository<Contact>,
    @InjectRepository(Team) private readonly teamsRepository: BaseRepository<Team>,
    @InjectRepository(UserContactAccount) private readonly userContactsAccountRepository: BaseRepository<UserContactAccount>,
    @InjectRepository(TeamContactAccount) private readonly teamContactsAccountRepository: BaseRepository<TeamContactAccount>,
    private readonly caslAbilityFactory: CaslAbilityFactory,
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

  public async findOne(contactId: number): Promise<Contact> {
    return await this.contactsRepository.findOneOrFail({ contactId });
  }

  public async update(contactId: number, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.contactsRepository.findOneOrFail({ contactId });

    wrap(contact).assign(updateContactDto);
    await this.contactsRepository.flush();
    return contact;
  }

  public async remove(contactId: number): Promise<void> {
    const contact = await this.contactsRepository.findOneOrFail({ contactId });
    await this.contactsRepository.removeAndFlush(contact);
  }

  public async addUserContactAccount(
    user: User,
    createContactAccountDto: CreateContactAccountDto,
  ): Promise<UserContactAccount> {
    const contact = await this.contactsRepository.findOneOrFail({ contactId: createContactAccountDto.contactId });
    const contactAccount = new UserContactAccount({ ...createContactAccountDto, user, contact });
    await this.userContactsAccountRepository.persistAndFlush(contactAccount);
    return contactAccount;
  }

  public async findAllUserContactAccounts(userId: string): Promise<UserContactAccount[]> {
    return await this.userContactsAccountRepository.find({ user: { userId } }, { populate: ['contact', 'user'] });
  }

  public async updateUserContactAccount(
    user: User,
    contactAccountId: number,
    updateContactDto: UpdateContactAccountDto,
  ): Promise<UserContactAccount> {
    const userContact = await this.userContactsAccountRepository.findOneOrFail(
      { contactAccountId },
      { populate: ['contact', 'user'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, userContact.user);

    wrap(userContact).assign(updateContactDto);
    await this.userContactsAccountRepository.flush();
    return userContact;
  }

  public async deleteUserContactAccount(user: User, contactAccountId: number): Promise<void> {
    const userContact = await this.userContactsAccountRepository.findOneOrFail(
      { contactAccountId },
      { populate: ['user'] },
    );

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Update, userContact.user);

    await this.userContactsAccountRepository.removeAndFlush(userContact);
  }

  public async addTeamContactAccount(
    requester: User,
    teamId: number,
    createContactAccountDto: CreateContactAccountDto,
  ): Promise<TeamContactAccount> {
    const team = await this.teamsRepository.findOneOrFail({ teamId }, { populate: ['members'] });
    // TODO: Move this to CASL
    if (!team.isTeamAdmin(requester))
      throw new ForbiddenException('Not a team admin');

    const contact = await this.contactsRepository.findOneOrFail({ contactId: createContactAccountDto.contactId });
    const contactAccount = new TeamContactAccount({ team, ...createContactAccountDto, contact });
    await this.teamContactsAccountRepository.persistAndFlush(contactAccount);
    return contactAccount;
  }

  public async findAllTeamContactAccounts(teamId: number): Promise<TeamContactAccount[]> {
    return await this.teamContactsAccountRepository.find(
      { team: { teamId } },
      { populate: ['contact', 'team'] },
    );
  }

  public async updateTeamContactAccount(
    requester: User,
    contactAccountId: number,
    updateContactDto: UpdateContactAccountDto,
  ): Promise<TeamContactAccount> {
    const teamContact = await this.teamContactsAccountRepository.findOneOrFail(
      { contactAccountId },
      { populate: ['contact', 'team', 'team.members'] },
    );
    // TODO: Move this to CASL
    if (!teamContact.team.isTeamAdmin(requester))
      throw new ForbiddenException('Not a team admin');

    wrap(teamContact).assign(updateContactDto);
    await this.teamContactsAccountRepository.flush();
    return teamContact;
  }

  public async deleteTeamContactAccount(requester: User, contactAccountId: number): Promise<void> {
    const teamContact = await this.teamContactsAccountRepository.findOneOrFail(
      { contactAccountId },
      { populate: ['team', 'team.members'] },
    );
    // TODO: Move this to CASL
    if (!teamContact.team.isTeamAdmin(requester))
      throw new ForbiddenException('Not a team admin');

    await this.teamContactsAccountRepository.removeAndFlush(teamContact);
  }
}
