import type { FilterQuery } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@common/lib/orm/base.repository';
import { ApprovalStepType } from '@common/lib/types/enums/approval-step-type.enum';
import { EventState } from '@common/lib/types/enums/event-state.enum';
import {
  AdminEventValidationApprovedNotification,
  AdminEventValidationRejectedNotification,
  AdminEventValidationStepNotification,
  EventManagedApprovedNotification,
  EventManagedRejectedNotification,
} from '@common/modules/notifications/notifications';
import { NotificationsService } from '@common/modules/notifications/notifications.service';
import type { PaginatedResult, PaginateDto } from '@common/modules/pagination';
import { ApprovalStep } from '@modules/org/tenants/approval-steps/approval-step.entity';
import type { Tenant } from '@modules/org/tenants/tenant.entity';
import type { CreateEventApprovalDto } from '@modules/plan/approvals/dto/create-approval.dto';
import type { User } from '@modules/uaa/users/user.entity';
import { Event } from '../events/event.entity';
import { EventApproval } from './approval.entity';
import type { ListEventApprovalsDto } from './dto/list-approvals.dto';

@Injectable()
export class EventApprovalsService {
  constructor(
    @InjectRepository(ApprovalStep) private readonly approvalStepRepository: BaseRepository<ApprovalStep>,
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(EventApproval)
    private readonly eventApprovalRepository: BaseRepository<EventApproval>,

    private readonly notificationsService: NotificationsService,
  ) {}

  public async create(
    tenant: Tenant,
    user: User,
    id: number,
    eventApprovalDto: CreateEventApprovalDto,
  ): Promise<EventApproval> {
    // 1. Check that the event exists and is validatable
    const event = await this.eventRepository.findOneOrFail({ id });
    if (event.state !== EventState.Submitted)
      throw new BadRequestException('Event not submitted');

    // 2. Fetch the next validation step required for the event
    const step = await this.approvalStepRepository.findOneOrFail({ id: eventApprovalDto.stepId, type: ApprovalStepType.Event }, { populate: ['users'] });

    // 3. Check that the person is allowed to submit a validation for this step
    if (!step.users.contains(user))
      throw new ForbiddenException('Not allowed for current step');

    const validated = await this.eventApprovalRepository.count({ event, step });
    if (validated)
      throw new BadRequestException('Already validated');

    // 4. Create the validation
    const approval = new EventApproval({
      ...eventApprovalDto,
      user,
      event,
      step,
    });
    await this.eventApprovalRepository.persistAndFlush(approval);

    event.lastApprovalStep = step;
    // 5. If we are rejecting the event, we need to update the event state
    if (!eventApprovalDto.approved) {
      // => Rejected !
      event.state = EventState.Rejected;
      await this.eventRepository.flush();

      void this.notificationsService.triggerFirst(
        new AdminEventValidationRejectedNotification(approval),
        new EventManagedRejectedNotification(event, { message: eventApprovalDto.message }),
      );

      return approval;
    }

    const nextStep = await this.approvalStepRepository.findOne({
      type: ApprovalStepType.Event,
      tenant,
      step: step.step + 1,
    });

    if (!nextStep) {
      // => Approved !
      event.state = EventState.Published;
      await this.eventRepository.flush();

      void this.notificationsService.triggerFirst(
        new EventManagedApprovedNotification(event),
        new AdminEventValidationApprovedNotification(event),
      );

      return approval;
    }

    // 6.b. Advance to the next step
    await this.eventRepository.flush();

    void this.notificationsService.trigger(new AdminEventValidationStepNotification(event, nextStep));

    return approval;
  }

  public async findAll(
    query: ListEventApprovalsDto,
    options?: Required<PaginateDto>,
  ): Promise<PaginatedResult<EventApproval>> {
    let filter: FilterQuery<EventApproval> = {};

    if (typeof query.step === 'number')
      filter = { ...filter, step: query.step };
    if (typeof query.teamId === 'number')
      filter = { ...filter, event: { team: { id: query.teamId } } };
    else if (query.state)
      filter = { ...filter, event: { state: query.state } };

    return await this.eventApprovalRepository.findWithPagination(
      options,
      filter,
      { populate: ['event', 'user', 'step', 'step.users'] },
    );
  }

  public async findOne(id: number): Promise<EventApproval[]> {
    return await this.eventApprovalRepository.find({ event: { id } });
  }
}
