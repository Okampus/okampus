import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import {
  Tag,
  TenantCore,
  TenantEvent,
  TenantEventRepository,
  TenantEventOptions,
  Individual,
  ImageUpload,
  EventApprovalStep,
  Form,
  FormSubmission,
  User,
  OrgRepository,
  UserRepository,
} from '@okampus/api/dal';
import { CreateEventDto, ITenantEvent } from '@okampus/shared/dtos';
import { loadEvent } from '../loader.utils';
import { BaseFactory } from '../base.factory';
import { ContentModel } from '../contents/content.model';
import { TenantEventModel } from './event.model';

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
  async createEvent(
    createEvent: CreateEventDto,
    tenant: TenantCore,
    individual: Individual
  ): Promise<TenantEventModel> {
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
      createdBy: individual,
      tenant: tenant,
      supervisor,
      org,
    });
  }

  entityToModel(entity: TenantEvent): TenantEventModel | undefined {
    const event = loadEvent(entity);
    if (!event) return undefined;
    return this.createModel(event);
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
