import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { TeamEventState } from '@meta/shared/lib/types/enums/team-event-state.enum';
import { ValidationStepType } from '@meta/shared/lib/types/enums/validation-step-type.enum';
import {
  AdminTeamEventValidationApprovedNotification,
  AdminTeamEventValidationRejectedNotification,
  AdminTeamEventValidationStepNotification,
  TeamEventManagedApprovedNotification,
  TeamEventManagedRejectedNotification,
} from '@meta/shared/modules/notifications/notifications';
import { NotificationsService } from '@meta/shared/modules/notifications/notifications.service';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import { ValidationStep } from '@modules/org/tenants/validation-steps/validation-step.entity';
import type { CreateTeamEventValidationDto } from '@modules/plan/event-validations/dto/create-team-event-validation.dto';
import type { User } from '@modules/uua/users/user.entity';
import { TeamEvent } from '../events/team-event.entity';
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
    const step = await this.validationStepRepository.findOneOrFail({ id: createTeamEventValidationDto.stepId, type: ValidationStepType.TeamEvent }, { populate: ['users'] });

    // 3. Check that the person is allowed to submit a validation for this step
    if (!step.users.contains(user))
      throw new ForbiddenException('Not allowed for current step');

    const validated = await this.teamEventValidationRepository.count({ event, step });
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

    event.lastValidationStep = step;
    // 5. If we are rejecting the event, we need to update the event state
    if (!createTeamEventValidationDto.approved) {
      // => Rejected !
      event.state = TeamEventState.Rejected;
      await this.teamEventRepository.flush();

      void this.notificationsService.triggerFirst(
        new AdminTeamEventValidationRejectedNotification(validation),
        new TeamEventManagedRejectedNotification(event, { message: createTeamEventValidationDto.message }),
      );

      return validation;
    }

    const nextStep = await this.validationStepRepository.findOne({
      type: ValidationStepType.TeamEvent,
      tenant,
      step: step.step + 1,
    });

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
}
