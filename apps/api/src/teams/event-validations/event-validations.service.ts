import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { TeamEventState } from '../../shared/lib/types/enums/team-event-state.enum';
import { ValidationStepType } from '../../shared/lib/types/enums/validation-step-type.enum';
import {
  AdminTeamEventValidationApprovedNotification,
  AdminTeamEventValidationRejectedNotification,
  AdminTeamEventValidationStepNotification,
  TeamEventManagedApprovedNotification,
  TeamEventManagedRejectedNotification,
} from '../../shared/modules/notifications/notifications';
import { NotificationsService } from '../../shared/modules/notifications/notifications.service';
import type { PaginatedResult, PaginateDto } from '../../shared/modules/pagination';
import type { Tenant } from '../../tenants/tenants/tenant.entity';
import { ValidationStep } from '../../tenants/validation-steps/validation-step.entity';
import type { User } from '../../users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
import type { CreateTeamEventValidationDto } from './dto/create-team-event-validation.dto';
import type { ListTeamEventValidationsDto } from './dto/list-team-event-validations.dto';
import { TeamEventValidation } from './team-event-validation.entity';

@Injectable()
export class TeamEventValidationsService {
  constructor(
    @InjectRepository(ValidationStep) private readonly validationStepRepository: BaseRepository<ValidationStep>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(TeamEventValidation)
    private readonly teamEventValidationRepository: BaseRepository<TeamEventValidation>,

    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(
    tenant: Tenant,
    user: User,
    id: number,
    createTeamEventValidationDto: CreateTeamEventValidationDto,
  ): Promise<TeamEventValidation> {
    // 1. Check that the event exists and is validatable
    const event = await this.teamEventRepository.findOneOrFail({ id });
    if (event.state !== TeamEventState.Submitted)
      throw new BadRequestException('Event not submitted');

    // 2. Fetch the next validation step required for the event
    const step = await this.validationStepRepository.findOneOrFail({
      type: ValidationStepType.TeamEvent,
      tenant,
      step: event.validationStep + 1,
    }, { populate: ['users'] });

    // 3. Check that the person is allowed to submit a validation for this step
    if (!step.users.contains(user))
      throw new ForbiddenException('Not allowed for current step');

    const validated = await this.teamEventValidationRepository.count({ event, step: event.validationStep, user });
    if (validated)
      throw new BadRequestException('Already validated');

    // 4. Create the validation
    const validation = new TeamEventValidation({
      ...createTeamEventValidationDto,
      user,
      event,
      step,
    });
    await this.teamEventValidationRepository.persistAndFlush(validation);

    // 5. If we are rejecting the event, we need to update the event state
    if (!createTeamEventValidationDto.approved) {
      // => Rejected !
      event.state = TeamEventState.Rejected;
      event.validationStep = 0;
      await this.teamEventRepository.flush();

      void this.notificationsService.triggerFirst(
        new AdminTeamEventValidationRejectedNotification(validation),
        new TeamEventManagedRejectedNotification(event, { message: createTeamEventValidationDto.message }),
      );

      return validation;
    }

    // 6. If we are the last person of the current step, advance to the next step
    const alreadyValidated = await this.teamEventValidationRepository.count({ event, step: event.validationStep + 1 });
    if (alreadyValidated === step.users.length) {
      // 7. If we are at the last step, publish the event
      const nextStep = await this.validationStepRepository.findOne({
        type: ValidationStepType.TeamEvent,
        tenant,
        step: event.validationStep + 2,
      });
      event.validationStep++;

      if (!nextStep) {
        // => Approved !
        event.state = TeamEventState.Published;
        await this.teamEventRepository.flush();

        void this.notificationsService.triggerFirst(
          new TeamEventManagedApprovedNotification(event),
          new AdminTeamEventValidationApprovedNotification(event),
        );

        return validation;
      }

      // 6.b. Advance to the next step
      await this.teamEventRepository.flush();

      void this.notificationsService.trigger(new AdminTeamEventValidationStepNotification(event, nextStep));
    }

    return validation;
  }

  public async findAll(
    query: ListTeamEventValidationsDto,
    options?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamEventValidation>> {
    let filter: FilterQuery<TeamEventValidation> = {};

    if (typeof query.step === 'number')
      filter = { ...filter, step: query.step };
    if (typeof query.teamId === 'number')
      filter = { ...filter, event: { team: { id: query.teamId } } };
    else if (query.state)
      filter = { ...filter, event: { state: query.state } };

    return await this.teamEventValidationRepository.findWithPagination(
      options,
      filter,
      { populate: ['event', 'user', 'step', 'step.users'] },
    );
  }

  public async findOne(id: number): Promise<TeamEventValidation[]> {
    return await this.teamEventValidationRepository.find({ event: { id } });
  }

  public async findMyEvents(
    tenant: Tenant,
    user: User,
    options?: Required<PaginateDto>,
  ): Promise<PaginatedResult<TeamEvent>> {
    const steps = await this.validationStepRepository.find({
      tenant,
      type: ValidationStepType.TeamEvent,
    }, { populate: ['users'] });

    const mySteps = steps.filter(step => step.users.contains(user)).map(step => step.step);

    return await this.teamEventRepository.findWithPagination(
      options,
      { validationStep: { $in: mySteps } },
      { populate: ['team', 'validationStep'], orderBy: { validationStep: 'desc' } },
    );
  }

  public async findValidationsLeftForEvent(tenant: Tenant, id: number): Promise<Array<Omit<ValidationStep, 'users'> & { users: User[] }>> {
    const event = await this.teamEventRepository.findOneOrFail({ id, state: TeamEventState.Submitted });

    const steps = await this.validationStepRepository.find({
      tenant,
      type: ValidationStepType.TeamEvent,
      step: { $gte: event.validationStep },
    }, { populate: ['users'] });

    const doneValidations = await this.teamEventValidationRepository.find({ event, step: event.validationStep });
    const doneUsers = new Set(doneValidations.map(v => v.user));

    const clonedSteps = steps.map(step => ({ ...step, users: step.users.getItems() }));
    // Remove users that have already validated the current step
    clonedSteps[0].users = clonedSteps[0].users.filter(user => !doneUsers.has(user));

    return clonedSteps;
  }
}
