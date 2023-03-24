import { TenantEventModel } from '../../index';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TenantEventRepository, OrgRepository, UserRepository, Org, Project, EventRole } from '@okampus/api/dal';
import {
  EventApprovalStep,
  Form,
  FormSubmission,
  ImageUpload,
  Individual,
  Tag,
  TenantCore,
  TenantEvent,
  User,
} from '@okampus/api/dal';

import type { TenantEventOptions } from '@okampus/api/dal';
import type { CreateEventDto, ITenantEvent } from '@okampus/shared/dtos';
import type { ContentModel } from '../contents/content.model';

@Injectable()
export class TenantEventFactory extends BaseFactory<TenantEventModel, TenantEvent, ITenantEvent, TenantEventOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    eventRepository: TenantEventRepository,
    uploadService: UploadService,
    private readonly em: EntityManager,
    private readonly userRepository: UserRepository,
    private readonly orgRepository: OrgRepository
  ) {
    super(eventPublisher, uploadService, eventRepository, TenantEventModel, TenantEvent);
  }

  // TODO: refactor with similar logic as in update with a callback
  async createEvent(createEvent: CreateEventDto, tenant: TenantCore, requester: Individual): Promise<TenantEventModel> {
    const orgs = await this.orgRepository.findByIds(createEvent.orgIds);

    const supervisor = await this.userRepository.findById(createEvent.supervisorId);
    // TODO: check if user is allowed to add this supervisor
    if (!supervisor) throw new BadRequestException(`Supervisor with id ${createEvent.supervisorId} not found`);

    return this.create({
      ...createEvent,
      createdBy: requester,
      tenant: tenant,
      supervisor,
      orgs,
    });
  }

  modelToEntity(model: Required<TenantEventModel> & { rootContent: Required<ContentModel> }): TenantEvent {
    return new TenantEvent({
      ...model,
      contributors: model.contributors.map((contributor) => this.em.getReference(Individual, contributor.id)),
      image: model.image ? this.em.getReference(ImageUpload, model.image.id) : null,
      lastEventApprovalStep: model.lastEventApprovalStep
        ? this.em.getReference(EventApprovalStep, model.lastEventApprovalStep.id)
        : null,
      linkedProject: model.linkedProject ? this.em.getReference(Project, model.linkedProject.id) : null,
      orgs: model.orgs.map((org) => this.em.getReference(Org, org.id)),
      tags: model.tags.map((tag) => this.em.getReference(Tag, tag.id)),
      joinForm: model.joinForm ? this.em.getReference(Form, model.joinForm.id) : null,
      regularEvent: model.regularEvent ? this.em.getReference(TenantEvent, model.regularEvent.id) : null,
      supervisor: this.em.getReference(User, model.supervisor.id),
      approvalSubmission: model.approvalSubmission
        ? this.em.getReference(FormSubmission, model.approvalSubmission.id)
        : null,
      roles: model.roles.map((role) => this.em.getReference(EventRole, role.id)),
      createdBy: model.createdBy ? this.em.getReference(Individual, model.createdBy.id) : null, // TODO: check if this is correct in every case
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
