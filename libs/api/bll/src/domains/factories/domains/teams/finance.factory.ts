import { Inject, Injectable } from '@nestjs/common';
import { EventPublisher } from '@nestjs/cqrs';
import { CreateFinanceDto, IFinance } from '@okampus/shared/dtos';
// import { loadFinance } from '../loader.utils';
import { BaseFactory } from '../../base.factory';
import { FinanceModel } from './finance.model';
import {
  FileUpload,
  Finance,
  FinanceOptions,
  FinanceRepository,
  Individual,
  Project,
  ProjectRepository,
  Team,
  TeamRepository,
  TenantCore,
  TenantEvent,
  TenantEventRepository,
} from '@okampus/api/dal';
import { MulterFileType } from '@okampus/shared/types';
import { UploadService } from '../../../../features/uploads/upload.service';
import { ResourceType } from '@okampus/shared/enums';
import { asyncCallIfNotNull, filterNullPromiseAll } from '@okampus/shared/utils';

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
