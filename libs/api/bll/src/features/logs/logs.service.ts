import { RequestContext } from '../../shards/abstract/request-context';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BaseEntity, ContentMaster, Individual, Log, LogRepository, Team, TeamRepository } from '@okampus/api/dal';

import { Injectable } from '@nestjs/common';
import { EntityName, EventContext, EventType } from '@okampus/shared/enums';
import { DiffType } from '@okampus/shared/types';

import { isIn } from '@okampus/shared/utils';
import type { LogDiff } from '@okampus/shared/types';

export type LogContext = {
  contentMaster?: ContentMaster;
  individual?: Individual;
  team?: Team;
};

@Injectable()
export class LogsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly logRepository: LogRepository,
    private readonly teamRepository: TeamRepository
  ) {
    super();
  }

  async createLog(entityName: EntityName, entity: BaseEntity, context: LogContext = {}) {
    const createLog = new Log({
      event: EventType.Create,
      context: this.requester().bot ? EventContext.Bot : EventContext.User,
      entityName,
      entityId: entity.id,
      individual: context.individual || this.requester(),
      contentMaster: context.contentMaster,
      team: context.team,
      createdBy: this.requester(),
      tenant: this.tenant(),
    });
    await this.em.persistAndFlush(createLog);
  }

  async deleteLog(entityName: EntityName, entityId: string, context: LogContext = {}) {
    const deleteLog = new Log({
      event: EventType.Delete,
      context: this.requester().bot ? EventContext.Bot : EventContext.User,
      entityName,
      entityId,
      individual: context.individual || this.requester(),
      contentMaster: context.contentMaster,
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
              if (before !== value) diff[field] = { before, after: value, type: DiffType.Rel };
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
        event: EventType.Update,
        context: this.requester().bot ? EventContext.Bot : EventContext.User,
        entityName,
        entityId: entity.id,
        individual: context.individual || this.requester(),
        contentMaster: context.contentMaster,
        team: context.team,
        diff,
        createdBy: this.requester(),
        tenant: this.tenant(),
      });
      await this.em.persistAndFlush(updateLog);
    }
  }

  public async getTeamFinanceLogs(id: string, teamId: string) {
    const team = await this.teamRepository.findOneOrFail(teamId);
    // TODO: check permissions
    return await this.logRepository.find({
      entityId: id,
      entityName: EntityName.TeamFinance,
      team,
    });
  }
}
