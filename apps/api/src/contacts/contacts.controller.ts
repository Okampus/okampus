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
// Import { SerializerIncludeTeamContacts } from '../shared/lib/decorators/serializers.decorator';
import { Action, CheckPolicies } from '../shared/modules/authorization';
import { Team } from '../teams/teams/team.entity';
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
// @SerializerIncludeTeamContacts()
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

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Contact))
  public async findOne(@Param('id', ParseIntPipe) id: number): Promise<Contact | null> {
    return await this.contactsService.findOne(id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Update, Contact))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactDto: UpdateContactDto,
  ): Promise<Contact> {
    return await this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Delete, Contact))
  public async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.contactsService.remove(id);
  }

  @Post('/users')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async addUserContactAccount(
    @Body() createContactAccountDto: CreateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<UserContactAccount> {
    return await this.contactsService.addUserContactAccount(user, createContactAccountDto);
  }

  @Get('/users/:id')
  @CheckPolicies(ability => ability.can(Action.Read, User))
  public async findAllUserContactAccounts(@Param('id') id: string): Promise<UserContactAccount[]> {
    return await this.contactsService.findAllUserContactAccounts(id);
  }

  @Patch('/users/account/:id')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async updateUserContactAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactAccountDto: UpdateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<UserContactAccount> {
    return await this.contactsService.updateUserContactAccount(user, id, updateContactAccountDto);
  }

  @Delete('/users/account/:id')
  @CheckPolicies(ability => ability.can(Action.Update, User))
  public async deleteUserContactAccount(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contactsService.deleteUserContactAccount(user, id);
  }

  @Post('/teams/:id')
  @CheckPolicies(ability => ability.can(Action.Update, Team))
  public async addTeamContact(
    @Param('id', ParseIntPipe) id: number,
    @Body() createContactAccountDto: CreateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<TeamContactAccount> {
    return await this.contactsService.addTeamContactAccount(user, id, createContactAccountDto);
  }

  @Get('/teams/:id')
  @CheckPolicies(ability => ability.can(Action.Read, Team))
  public async findAllTeamContactAccounts(@Param('id', ParseIntPipe) id: number): Promise<TeamContactAccount[]> {
    return await this.contactsService.findAllTeamContactAccounts(id);
  }

  @Patch('/teams/account/:id')
  public async updateTeamContactAccount(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateContactAccountDto: UpdateContactAccountDto,
    @CurrentUser() user: User,
  ): Promise<TeamContactAccount> {
    return await this.contactsService.updateTeamContactAccount(user, id, updateContactAccountDto);
  }

  @Delete('/teams/account/:id')
  public async deleteTeamContactAccount(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.contactsService.deleteTeamContactAccount(user, id);
  }
}
