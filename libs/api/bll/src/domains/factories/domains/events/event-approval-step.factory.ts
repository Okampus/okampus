import { EventApprovalStepModel } from './event-approval-step.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  EventApprovalStepRepository,
  IndividualRepository,
  UserRepository,
  TenantRepository,
  TenantCore,
} from '@okampus/api/dal';
import { EventApprovalStep, Individual, Tenant, User } from '@okampus/api/dal';

import type { EventApprovalStepOptions } from '@okampus/api/dal';
import type { CreateEventApprovalStepDto, IEventApprovalStep } from '@okampus/shared/dtos';

@Injectable()
export class EventApprovalStepFactory extends BaseFactory<
  EventApprovalStepModel,
  EventApprovalStep,
  IEventApprovalStep,
  EventApprovalStepOptions
> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    eventApprovalStepRepository: EventApprovalStepRepository,
    private readonly em: EntityManager,
    private readonly individualRepository: IndividualRepository,
    private readonly userRepository: UserRepository,
    private readonly tenantRepository: TenantRepository
  ) {
    super(eventPublisher, eventApprovalStepRepository, EventApprovalStepModel, EventApprovalStep);
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
      tenantOrg: this.em.getReference(Tenant, model.tenantOrg.id),
      notifiees: model.notifiees.map((notifiee) => this.em.getReference(User, notifiee.id)),
      validators: model.validators.map((validator) => this.em.getReference(Individual, validator.id)),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null,
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
