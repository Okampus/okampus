import { FinanceModel } from './finance.model';
import { BaseFactory } from '../../base.factory';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { UploadService } from '../../../../features/uploads/upload.service';

import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';

import { Finance } from '@okampus/api/dal';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { FinanceRepository, ProjectRepository, TeamRepository, TenantEventRepository } from '@okampus/api/dal';

import { ResourceType } from '@okampus/shared/enums';
import { asyncCallIfNotNull, filterNullPromiseAll } from '@okampus/shared/utils';
import type { CreateFinanceDto, IFinance } from '@okampus/shared/dtos';
import type { FileUpload, FinanceOptions, Individual, Project, Team, TenantCore, TenantEvent } from '@okampus/api/dal';
import type { MulterFileType } from '@okampus/shared/types';

@Injectable()
export class FinanceFactory extends BaseFactory<FinanceModel, Finance, IFinance, FinanceOptions> {
  constructor(
    @Inject(EventPublisher) ep: EventPublisher,
    financeRepository: FinanceRepository,
    private readonly uploadService: UploadService,
    private readonly teamRepository: TeamRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly tenantEventRepository: TenantEventRepository
  ) {
    super(ep, financeRepository, FinanceModel, Finance);
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

  // entityToModel(entity: Finance): FinanceModel | undefined {
  //   const form = loadFinance(entity);
  //   if (!form) return undefined;
  //   return this.createModel(form);
  // }

  modelToEntity(model: Required<FinanceModel>): Finance {
    return new Finance({
      ...model,
      createdBy: { id: model.createdBy.id } as Individual,
      team: { id: model.team.id } as Team,
      linkedProject: model.linkedProject ? ({ id: model.linkedProject.id } as Project) : null,
      linkedEvent: model.linkedEvent ? ({ id: model.linkedEvent.id } as TenantEvent) : null,
      receipts: model.receipts.map((file) => ({ id: file.id } as FileUpload)),
      tenant: { id: model.tenant.id } as TenantCore,
    });
  }
}
