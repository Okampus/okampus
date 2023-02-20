import { FinanceModel } from './finance.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/upload/upload.service';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FinanceRepository, ProjectRepository, TeamRepository, TenantEventRepository } from '@okampus/api/dal';
import { Finance, FileUpload, Individual, Project, Team, TenantCore, TenantEvent } from '@okampus/api/dal';

import { ResourceType } from '@okampus/shared/enums';
import { asyncCallIfNotNull, filterNullPromiseAll } from '@okampus/shared/utils';

import type { CreateFinanceDto, IFinance } from '@okampus/shared/dtos';
import type { MulterFileType } from '@okampus/shared/types';
import type { FinanceOptions } from '@okampus/api/dal';

@Injectable()
export class FinanceFactory extends BaseFactory<FinanceModel, Finance, IFinance, FinanceOptions> {
  constructor(
    @Inject(EventPublisher) eventPublisher: EventPublisher,
    financeRepository: FinanceRepository,
    private readonly em: EntityManager,
    private readonly uploadService: UploadService,
    private readonly teamRepository: TeamRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly tenantEventRepository: TenantEventRepository
  ) {
    super(eventPublisher, financeRepository, FinanceModel, Finance);
  }

  async createFinance(
    createFinance: CreateFinanceDto,
    requester: Individual,
    tenant: TenantCore,
    receiptFiles?: MulterFileType[]
  ): Promise<FinanceModel> {
    const files = receiptFiles ?? [];

    const teamPopulate = (this.autoGqlPopulate()
      ?.filter((str: string) => str.startsWith(`team.`))
      ?.map((str: string) => str.replace(`team.`, '')) ?? ['finances']) as never[];

    const [team, linkedEvent, linkedProject, receipts] = await Promise.all([
      this.teamRepository.findOneOrFail({ id: createFinance.teamId }),
      asyncCallIfNotNull(createFinance.linkedEventId, (id) => this.tenantEventRepository.findOneOrFail({ id })),
      asyncCallIfNotNull(createFinance.linkedProjectId, (id) => this.projectRepository.findOneOrFail({ id })),
      filterNullPromiseAll(files.map((file) => this.uploadService.createFileUpload(tenant, file, ResourceType.Org))),
    ]);

    team.currentFinance -= createFinance.amountPayed ?? 0;

    return this.create(
      {
        ...createFinance,
        createdBy: requester,
        team,
        tenant,
        linkedProject,
        linkedEvent,
        receipts,
      },
      async (finance) => {
        await this.teamRepository.populate(team, teamPopulate);
        team.finances.add(finance);
        return finance;
      }
    );
  }

  modelToEntity(model: Required<FinanceModel>): Finance {
    return new Finance({
      ...model,
      createdBy: this.em.getReference(Individual, model.createdBy.id),
      team: this.em.getReference(Team, model.team.id),
      linkedProject: model.linkedProject ? this.em.getReference(Project, model.linkedProject.id) : null,
      linkedEvent: model.linkedEvent ? this.em.getReference(TenantEvent, model.linkedEvent.id) : null,
      receipts: model.receipts.map((file) => this.em.getReference(FileUpload, file.id)),
      tenant: this.em.getReference(TenantCore, model.tenant.id),
    });
  }
}
