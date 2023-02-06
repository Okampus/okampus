import { TenantEventModel } from './event.model';
import { BaseFactory } from '../../base.factory';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { TenantEvent } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantEventRepository, OrgRepository, UserRepository } from '@okampus/api/dal';

import type {
  Tag,
  TenantCore,
  TenantEventOptions,
  Individual,
  ImageUpload,
  EventApprovalStep,
  Form,
  FormSubmission,
  User,
} from '@okampus/api/dal';
import type { CreateEventDto, ITenantEvent } from '@okampus/shared/dtos';
import type { ContentModel } from '../contents/content.model';

@Injectable()
export class TenantEventFactory extends BaseFactory<TenantEventModel, TenantEvent, ITenantEvent, TenantEventOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    private readonly userRepository: UserRepository,
    private readonly orgRepository: OrgRepository,
    eventRepository: TenantEventRepository
  ) {
    super(ep, eventRepository, TenantEventModel, TenantEvent);
  }

  // TODO: refactor with similar logic as in update with a callback
  async createEvent(createEvent: CreateEventDto, tenant: TenantCore, requester: Individual): Promise<TenantEventModel> {
    const supervisor = await this.userRepository.findById(createEvent.supervisorId);
    // TODO: check if user is allowed to add this supervisor
    if (!supervisor) throw new BadRequestException(`Supervisor with id ${createEvent.supervisorId} not found`);

    let org = null;
    if (createEvent.orgId) {
      org = await this.orgRepository.findOrgById(createEvent.orgId);
      // TODO: check if user is allowed to add this supervisor
      if (!org) throw new BadRequestException(`Org with id ${createEvent.orgId} not found`);
    }

    return this.create({
      ...createEvent,
      createdBy: requester,
      tenant: tenant,
      supervisor,
      org,
    });
  }

  modelToEntity(model: Required<TenantEventModel> & { rootContent: Required<ContentModel> }): TenantEvent {
    return new TenantEvent({
      ...model,
      tenant: { id: model.tenant.id } as TenantCore,
      contributors: model.contributors.map((contributor) => ({ id: contributor.id } as Individual)),
      image: model.image ? ({ id: model.image.id } as ImageUpload) : null,
      lastEventApprovalStep: model.lastEventApprovalStep
        ? ({ id: model.lastEventApprovalStep.id } as EventApprovalStep)
        : null,
      tags: model.tags.map((tag) => ({ id: tag.id } as Tag)),
      joinForm: model.joinForm ? ({ id: model.joinForm.id } as Form) : null,
      regularEvent: model.regularEvent ? ({ id: model.regularEvent.id } as TenantEvent) : null,
      supervisor: { id: model.supervisor.id } as User,
      approvalSubmission: model.approvalSubmission ? ({ id: model.approvalSubmission.id } as FormSubmission) : null,
      createdBy: { id: model.rootContent.author.id } as Individual, // TODO: check if this is correct in every case
    });
  }
}
