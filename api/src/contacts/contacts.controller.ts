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
import { SerializerIncludeClubContacts } from '../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { User } from '../users/user.entity';
import { ContactsService } from './contacts.service';
import { CreateContactAccountDto } from './dto/create-contact-account.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactAccountDto } from './dto/update-contact-account.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import type { ClubContactAccount } from './entities/club-contact-account.entity';
import { Contact } from './entities/contact.entity';
import type { UserContactAccount } from './entities/user-contact-account.entity';

@ApiTags('Contacts')
@Controller({ path: 'contacts' })
@SerializerIncludeClubContacts()
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
  ) {}

  @Post()
  @CheckPolicies(ability => ability.can(Action.Create, Contact))
  public async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return await this.contactsService.create(createContactDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Contact))
  public async findAll(): Promise<Contact[]> {
    return await this.contactsService.findAll();
  }

  @Get(':contactId')
  @CheckPolicies(ability => ability.can(Action.Read, Contact))
  public async findOne(@Param('contactId', ParseIntPipe) contactId: number): Promise<Contact | null> {
    return await this.contactsService.findOne(contactId);
  }

  @Patch(':contactId')
  @CheckPolicies(ability => ability.can(Action.Update, Contact))
  public async update(
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return await this.contactsService.update(contactId, updateContactDto);
  }

  @Delete(':contactId')
  @CheckPolicies(ability => ability.can(Action.Delete, Contact))
  public async remove(@Param('contactId', ParseIntPipe) contactId: number): Promise<void> {
    await this.contactsService.remove(contactId);
  }

  @Post('/users')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async addUserContactAccount(
    @Body() createContactAccountDto: CreateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<UserContactAccount> {
    return await this.contactsService.addUserContactAccount(user, createContactAccountDto);
  }

  @Get('/users/:userId')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findAllUserContactAccounts(@Param('userId') userId: string): Promise<UserContactAccount[]> {
    return await this.contactsService.findAllUserContactAccounts(userId);
  }

  @Patch('/users/account/:contactAccountId')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async updateUserContactAccount(
    @Param('contactAccountId', ParseIntPipe) contactAccountId: number,
    @Body() updateContactAccountDto: UpdateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<UserContactAccount> {
    return await this.contactsService.updateUserContactAccount(user, contactAccountId, updateContactAccountDto);
  }

  @Delete('/users/account/:contactAccountId')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async deleteUserContactAccount(
    @Param('contactAccountId', ParseIntPipe) contactAccountId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contactsService.deleteUserContactAccount(user, contactAccountId);
  }

  @Post('/clubs/:clubId')
  @CheckPolicies(ability => ability.can(Action.Update, Club))
  public async addClubContact(
    @Param('clubId', ParseIntPipe) clubId: number,
    @Body() createContactAccountDto: CreateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<ClubContactAccount> {
    return await this.contactsService.addClubContactAccount(user, clubId, createContactAccountDto);
  }

  @Get('/clubs/:clubId')
  @CheckPolicies(ability => ability.can(Action.Read, Club))
  public async findAllClubContactAccounts(@Param('clubId', ParseIntPipe) clubId: number): Promise<ClubContactAccount[]> {
    return await this.contactsService.findAllClubContactAccounts(clubId);
  }

  @Patch('/clubs/account/:contactAccountId')
  public async updateClubContactAccount(
    @Param('contactAccountId', ParseIntPipe) contactAccountId: number,
    @Body() updateContactAccountDto: UpdateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<ClubContactAccount> {
    return await this.contactsService.updateClubContactAccount(user, contactAccountId, updateContactAccountDto);
  }

  @Delete('/clubs/account/:contactAccountId')
  public async deleteClubContactAccount(
    @Param('contactAccountId', ParseIntPipe) contactAccountId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contactsService.deleteClubContactAccount(user, contactAccountId);
  }
}
