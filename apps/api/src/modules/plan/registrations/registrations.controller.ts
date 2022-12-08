import {
  BadRequestException,
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
import { CurrentUser } from '@common/lib/decorators/current-user.decorator';
import { Action, CheckPolicies } from '@common/modules/authorization';
import type { PaginatedNodes } from '@common/modules/pagination';
import { CreateEventRegistrationDto } from '@modules/plan/registrations/dto/create-event-registration.dto';
import { User } from '@modules/uaa/users/user.entity';
import { Event } from '../events/event.entity';
import { ListRegisteredEventsDto } from './dto/list-registered-events.dto';
import { UpdateEventRegistrationDto } from './dto/update-event-registration.dto';
import type { EventRegistration } from './registration.entity';
import { EventRegistrationsService } from './registrations.service';

@ApiTags('Event Registrtations')
@Controller()
export class EventRegistrationsController {
  constructor(
    private readonly eventRegistrationsService: EventRegistrationsService,
  ) {}

  @Post(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async create(
    @Param('id', ParseIntPipe) id: number,
    @Body() createEventRegistrationDto: CreateEventRegistrationDto,
    @CurrentUser() user: User,
  ): Promise<EventRegistration> {
    return await this.eventRegistrationsService.create(user, id, createEventRegistrationDto);
  }

  @Get()
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async findAll(
    @CurrentUser() user: User,
    @Query() query: ListRegisteredEventsDto,
  ): Promise<PaginatedNodes<EventRegistration>> {
    if (!query.eventId && !query.userId)
      throw new BadRequestException('Invalid filter query');

    return await this.eventRegistrationsService.findAll(user, query, query);
  }

  @Get(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<EventRegistration> {
    return await this.eventRegistrationsService.findOne(user, id);
  }

  @Patch(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventRegistrationDto: UpdateEventRegistrationDto,
    @CurrentUser() user: User,
  ): Promise<EventRegistration> {
    return await this.eventRegistrationsService.update(user, id, updateEventRegistrationDto);
  }

  @Delete(':id')
  @CheckPolicies(ability => ability.can(Action.Read, Event))
  public async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<void> {
    await this.eventRegistrationsService.remove(user, id);
  }
}
