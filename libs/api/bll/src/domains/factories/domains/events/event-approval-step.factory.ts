import { EventApprovalStepModel } from './event-approval-step.model';
import { BaseFactory } from '../../base.factory';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EventApprovalStepRepository, IndividualRepository, UserRepository, TenantRepository } from '@okampus/api/dal';

import { EventApprovalStep } from '@okampus/api/dal';
import type { EventApprovalStepOptions, Individual, Tenant, TenantCore, User } from '@okampus/api/dal';
import type { CreateEventApprovalStepDto, IEventApprovalStep } from '@okampus/shared/dtos';

@Injectable()
export class EventApprovalStepFactory extends BaseFactory<
  EventApprovalStepModel,
  EventApprovalStep,
  IEventApprovalStep,
  EventApprovalStepOptions
> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly individualRepository: IndividualRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository,
    eventApprovalStepRepository: EventApprovalStepRepository
  ) {
    super(ep, eventApprovalStepRepository, EventApprovalStepModel, EventApprovalStep);
  }

  async createEventApprovalStep(
    createEventApprovalStep: CreateEventApprovalStepDto,
    tenant: TenantCore,
    requester: Individual
  ): Promise<EventApprovalStepModel> {
    const tenantOrg = await this.tenantRepository.findById(tenant.id, { populate: ['actor'] as never[] });
    if (!tenantOrg) throw new BadRequestException('Invalid tenant id');

    const validators = await this.individualRepository.findByIds(createEventApprovalStep.validatorsIds);
    const notifiees = await this.userRepository.findByIds(createEventApprovalStep.notifieesIds);
    // const step = await this.eventApprovalStepRepository.findById(createEventApproval.stepId);
    // if (!step) throw new BadRequestException('Invalid step id');
    // const event = await this.eventRepository.findById(createEventApproval.eventId);
    // if (!event) throw new BadRequestException('Invalid event id');
    // // ({ id: createEventApproval.eventId });
    // console.log('tenantOrg', tenantOrg);

    return this.create({
      ...createEventApprovalStep,
      tenantOrg,
      notifiees,
      validators,
      tenant,
      createdBy: requester,
    });
  }

  modelToEntity(model: Required<EventApprovalStepModel>): EventApprovalStep {
    return new EventApprovalStep({
      ...model,
      tenant: { id: model.tenantOrg.id } as TenantCore,
      tenantOrg: { id: model.tenantOrg.id } as Tenant,
      notifiees: model.notifiees.map((notifiee) => ({ id: notifiee.id } as User)),
      validators: model.validators.map((validator) => ({ id: validator.id } as Individual)),
      createdBy: model.createdBy ? ({ id: model.createdBy.id } as Individual) : null,
    });
  }
}
