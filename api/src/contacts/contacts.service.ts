import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Club } from '../clubs/entities/club.entity';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { assertPermissions } from '../shared/lib/utils/assert-permission';
import { Action } from '../shared/modules/authorization';
import { CaslAbilityFactory } from '../shared/modules/casl/casl-ability.factory';
import { User } from '../users/user.entity';
import type { CreateContactAccountDto } from './dto/create-contact-account.dto';
import type { CreateContactDto } from './dto/create-contact.dto';
import type { UpdateContactAccountDto } from './dto/update-contact-account.dto';
import type { UpdateContactDto } from './dto/update-contact.dto';
import { ClubContactAccount } from './entities/club-contact-account.entity';
import { Contact } from './entities/contact.entity';
import { UserContactAccount } from './entities/user-contact-account.entity';

@Injectable()
export class ContactsService {
  // eslint-disable-next-line max-params
  constructor(
    /* eslint-disable max-len */
    @InjectRepository(Contact) private readonly contactsRepository: BaseRepository<Contact>,
    @InjectRepository(User) private readonly usersRepository: BaseRepository<User>,
    @InjectRepository(Club) private readonly clubsRepository: BaseRepository<Club>,
    @InjectRepository(UserContactAccount) private readonly userContactsAccountRepository: BaseRepository<UserContactAccount>,
    @InjectRepository(ClubContactAccount) private readonly clubContactsAccountRepository: BaseRepository<ClubContactAccount>,
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

  public async addClubContactAccount(
    requester: User,
    clubId: number,
    createContactAccountDto: CreateContactAccountDto,
  ): Promise<ClubContactAccount> {
    const club = await this.clubsRepository.findOneOrFail({ clubId }, { populate: ['members'] });
    // TODO: Move this to CASL
    if (!club.isClubAdmin(requester))
      throw new ForbiddenException('Not a club admin');

    const contact = await this.contactsRepository.findOneOrFail({ contactId: createContactAccountDto.contactId });
    const contactAccount = new ClubContactAccount({ club, ...createContactAccountDto, contact });
    await this.clubContactsAccountRepository.persistAndFlush(contactAccount);
    return contactAccount;
  }

  public async findAllClubContactAccounts(clubId: number): Promise<ClubContactAccount[]> {
    return await this.clubContactsAccountRepository.find(
      { club: { clubId } },
      { populate: ['contact', 'club', 'club.members'] },
    );
  }

  public async updateClubContactAccount(
    requester: User,
    contactAccountId: number,
    updateContactDto: UpdateContactAccountDto,
  ): Promise<ClubContactAccount> {
    const clubContact = await this.clubContactsAccountRepository.findOneOrFail(
      { contactAccountId },
      { populate: ['contact', 'club', 'club.members'] },
    );
    // TODO: Move this to CASL
    if (!clubContact.club.isClubAdmin(requester))
      throw new ForbiddenException('Not a club admin');

    wrap(clubContact).assign(updateContactDto);
    await this.clubContactsAccountRepository.flush();
    return clubContact;
  }

  public async deleteClubContactAccount(requester: User, contactAccountId: number): Promise<void> {
    const clubContact = await this.clubContactsAccountRepository.findOneOrFail(
      { contactAccountId },
      { populate: ['club', 'club.members'] },
    );
    // TODO: Move this to CASL
    if (!clubContact.club.isClubAdmin(requester))
      throw new ForbiddenException('Not a club admin');

    await this.clubContactsAccountRepository.removeAndFlush(clubContact);
  }
}
