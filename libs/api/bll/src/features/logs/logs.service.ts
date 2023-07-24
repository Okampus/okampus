import { RequestContext } from '../../shards/abstract/request-context';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import {
  BaseEntity,
  Individual,
  Log,
  LogRepository,
  Team,
  Event,
  FinanceRepository,
  TeamRepository,
  TenantRepository,
  EventRepository,
} from '@okampus/api/dal';

import {
  // ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  // AdminPermissions,
  EntityName,
  EventContext,
  EventType,
  // TeamPermissions
} from '@okampus/shared/enums';
import { DiffType } from '@okampus/shared/types';

import { isIn } from '@okampus/shared/utils';
import type { LogDiff } from '@okampus/shared/types';

export type LogContext = {
  event?: Event;
  individual?: Individual;
  team?: Team;
};

@Injectable()
export class LogsService extends RequestContext {
  private readonly logger = new Logger(LogsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly logRepository: LogRepository,
    private readonly eventRepository: EventRepository,
    private readonly financeRepository: FinanceRepository,
    private readonly teamRepository: TeamRepository,
    private readonly tenantRepository: TenantRepository
  ) {
    super();
  }

  async createLog(entityName: EntityName, entity: BaseEntity, context: LogContext = {}) {
    const createLog = new Log({
      eventType: EventType.Create,
      context: this.requester().bot ? EventContext.Bot : EventContext.User,
      entityName,
      entityId: entity.id,
      individual: context.individual || this.requester(),
      event: context.event,
      team: context.team,
      createdBy: this.requester(),
      tenant: this.tenant(),
    });
    await this.em.persistAndFlush(createLog);
  }

  async deleteLog(entityName: EntityName, entityId: string, context: LogContext = {}) {
    const deleteLog = new Log({
      eventType: EventType.Delete,
      context: this.requester().bot ? EventContext.Bot : EventContext.User,
      entityName,
      entityId,
      individual: context.individual || this.requester(),
      event: context.event,
      team: context.team,
      createdBy: this.requester(),
      tenant: this.tenant(),
    });
    await this.em.persistAndFlush(deleteLog);
  }

  async updateLog(
    entityName: EntityName,
    entity: BaseEntity,
    _set: Record<string, unknown>,
    context: LogContext & { ignoreFields?: string[] } = {}
  ) {
    const diff: LogDiff = {};
    for (const [key, value] of Object.entries(_set)) {
      if (context.ignoreFields?.includes(key)) continue;

      const validType =
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        typeof value === 'object';

      if (validType) {
        if (key.endsWith('Id')) {
          const field = key.replace('Id', '');
          if (isIn(field, entity)) {
            const fieldValue = entity[field];
            if (fieldValue instanceof BaseEntity) {
              const before = fieldValue.id;
              if (before !== value)
                diff[field] = { before, after: value, type: DiffType.Rel, relType: fieldValue.constructor.name };
            }
          }
        } else if (isIn(key, entity)) {
          const before = entity[key];
          if (before !== value && !(before instanceof BaseEntity)) {
            const valueType = value === null ? typeof before : typeof value;

            const type =
              valueType === 'string'
                ? DiffType.String
                : valueType === 'number'
                ? DiffType.Number
                : valueType === 'boolean'
                ? DiffType.Boolean
                : DiffType.Json;

            diff[key] = { before, after: value, type };
          }
        }
      }
    }

    if (Object.keys(diff).length > 0) {
      const updateLog = new Log({
        eventType: EventType.Update,
        context: this.requester().bot ? EventContext.Bot : EventContext.User,
        entityName,
        entityId: entity.id,
        individual: context.individual || this.requester(),
        event: context.event,
        team: context.team,
        diff,
        createdBy: this.requester(),
        tenant: this.tenant(),
      });
      await this.em.persistAndFlush(updateLog);
    }
  }

  public async getEventLogs(id: string) {
    // TODO: permissions
    // const isAllowed = await this.em.findOne(Team, {
    //   // teamMembers: { user: { id: this.requester().user?.id }, permissions: { $in: [TeamPermissions.ManageTreasury] } },
    //   tenant: {
    //     adminRoles: {
    //       permissions: { $in: [AdminPermissions.ManageTenantEntities] },
    //       individual: { id: this.requester().id },
    //     },
    //   },
    // });

    // if (!isAllowed) throw new ForbiddenException('You are not allowed to access this resource.');

    const event = await this.eventRepository.findOne({ id });
    if (!event) throw new NotFoundException(`Event (${id}) not found.`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logs = await this.logRepository.find({ event: { id } }, { populate: this.autoPopulate() as any });
    this.logger.log('Log', logs);
    return logs;
  }

  public async getFinanceLogs(id: string) {
    // TODO: permissions
    // const isAllowed = await this.em.findOne(Team, {
    //   // teamMembers: { user: { id: this.requester().user?.id }, permissions: { $in: [TeamPermissions.ManageTreasury] } },
    //   tenant: {
    //     adminRoles: {
    //       permissions: { $in: [AdminPermissions.ManageTenantEntities] },
    //       individual: { id: this.requester().id },
    //     },
    //   },
    // });

    // if (!isAllowed) throw new ForbiddenException('You are not allowed to access this resource.');

    const finance = await this.financeRepository.findOne({ id });
    if (!finance) throw new NotFoundException(`Finance (${id}) not found.`);

    return await this.logRepository.find(
      { entityId: id, entityName: EntityName.Finance },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { populate: this.autoPopulate() as any }
    );
  }

  public async getTeamLogs(id: string) {
    // TODO: permissions
    // const isAllowed = await this.em.findOne(Team, {
    //   // teamMembers: { user: { id: this.requester().user?.id }, permissions: { $in: [TeamPermissions.ManageTreasury] } },
    //   tenant: {
    //     adminRoles: {
    //       permissions: { $in: [AdminPermissions.ManageTenantEntities] },
    //       individual: { id: this.requester().id },
    //     },
    //   },
    // });

    // if (!isAllowed) throw new ForbiddenException('You are not allowed to access this resource.');

    const team = await this.teamRepository.findOne({ id });
    if (!team) throw new NotFoundException(`Team (${id}) not found.`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await this.logRepository.find({ team: { id } }, { populate: this.autoPopulate() as any });
  }

  public async getTenantLogs(id: string) {
    // TODO: permissions
    // const isAllowed = await this.em.findOne(Team, {
    //   // teamMembers: { user: { id: this.requester().user?.id }, permissions: { $in: [TeamPermissions.ManageTreasury] } },
    //   tenant: {
    //     adminRoles: {
    //       permissions: { $in: [AdminPermissions.ManageTenantEntities] },
    //       individual: { id: this.requester().id },
    //     },
    //   },
    // });

    // if (!isAllowed) throw new ForbiddenException('You are not allowed to access this resource.');

    const tenant = await this.tenantRepository.findOne({ id });
    if (!tenant) throw new NotFoundException(`Tenant (${id}) not found.`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return await this.logRepository.find({ tenant: { id } }, { populate: this.autoPopulate() as any });
  }
}
