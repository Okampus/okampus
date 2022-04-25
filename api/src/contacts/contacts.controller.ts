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
import { CurrentUser } from '../shared/lib/decorators/current-user.decorator';
import { SerializerIncludeTeamContacts } from '../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { Team } from '../teams/entities/team.entity';
import { User } from '../users/user.entity';
import { ContactsService } from './contacts.service';
import { CreateContactAccountDto } from './dto/create-contact-account.dto';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactAccountDto } from './dto/update-contact-account.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';
import type { TeamContactAccount } from './entities/team-contact-account.entity';
import type { UserContactAccount } from './entities/user-contact-account.entity';

@ApiTags('Contacts')
@Controller({ path: 'contacts' })
@SerializerIncludeTeamContacts()
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

  @Post('/teams/:teamId')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  public async addTeamContact(
    @Param('teamId', ParseIntPipe) teamId: number,
    @Body() createContactAccountDto: CreateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<TeamContactAccount> {
    return await this.contactsService.addTeamContactAccount(user, teamId, createContactAccountDto);
  }

  @Get('/teams/:teamId')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findAllTeamContactAccounts(@Param('teamId', ParseIntPipe) teamId: number): Promise<TeamContactAccount[]> {
    return await this.contactsService.findAllTeamContactAccounts(teamId);
  }

  @Patch('/teams/account/:contactAccountId')
  public async updateTeamContactAccount(
    @Param('contactAccountId', ParseIntPipe) contactAccountId: number,
    @Body() updateContactAccountDto: UpdateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<TeamContactAccount> {
    return await this.contactsService.updateTeamContactAccount(user, contactAccountId, updateContactAccountDto);
  }

  @Delete('/teams/account/:contactAccountId')
  public async deleteTeamContactAccount(
    @Param('contactAccountId', ParseIntPipe) contactAccountId: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contactsService.deleteTeamContactAccount(user, contactAccountId);
  }
}
