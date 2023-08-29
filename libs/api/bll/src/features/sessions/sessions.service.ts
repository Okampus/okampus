import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { SessionRepository, Session } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  SessionInsertInput,
  SessionOnConflict,
  SessionBoolExp,
  SessionOrderBy,
  SessionSelectColumn,
  SessionSetInput,
  SessionUpdates,
  SessionPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class SessionsService extends RequestContext {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly sessionRepository: SessionRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: SessionInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(session: Session) {
    if (session.deletedAt) throw new NotFoundException(`Session was deleted on ${session.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === session.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: SessionSetInput, session: Session) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (session.deletedAt) throw new NotFoundException(`Session was deleted on ${session.deletedAt}.`);
    if (session.hiddenAt) throw new NotFoundException('Session must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === session.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return session.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: SessionSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: SessionInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertSessionOne(selectionSet: string[], object: SessionInsertInput, onConflict?: SessionOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Session.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertSessionOne', selectionSet, object, onConflict);

    const session = await this.sessionRepository.findOneOrFail(data.insertSessionOne.id);
    await this.logsService.createLog(EntityName.Session, session);

    // Custom logic
    return data.insertSessionOne;
  }

  async findSession(
    selectionSet: string[],
    where: SessionBoolExp,
    orderBy?: Array<SessionOrderBy>,
    distinctOn?: Array<SessionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('session', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.session;
  }

  async findSessionByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('sessionByPk', selectionSet, { id });
    return data.sessionByPk;
  }

  async insertSession(selectionSet: string[], objects: Array<SessionInsertInput>, onConflict?: SessionOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Session.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertSession', selectionSet, objects, onConflict);

    for (const inserted of data.insertSession.returning) {
      const session = await this.sessionRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Session, session);
    }

    // Custom logic
    return data.insertSession;
  }

  async updateSessionMany(selectionSet: string[], updates: Array<SessionUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const sessions = await this.sessionRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const session = sessions.find((session) => session.id === update.where.id._eq);
        if (!session) throw new NotFoundException(`Session (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, session);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Session (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateSessionMany', selectionSet, updates);

    await Promise.all(
      sessions.map(async (session) => {
        const update = updates.find((update) => update.where.id._eq === session.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Session, session, update._set);
      }),
    );

    // Custom logic
    return data.updateSessionMany;
  }

  async updateSessionByPk(selectionSet: string[], pkColumns: SessionPkColumnsInput, _set: SessionSetInput) {
    const session = await this.sessionRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, session);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Session (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateSessionByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Session, session, _set);

    // Custom logic
    return data.updateSessionByPk;
  }

  async deleteSession(selectionSet: string[], where: SessionBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const sessions = await this.sessionRepository.findByIds(where.id._in);

    await Promise.all(
      sessions.map(async (session) => {
        const canDelete = await this.checkPermsDelete(session);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Session (${session.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateSession', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      sessions.map(async (session) => {
        await this.logsService.deleteLog(EntityName.Session, session.id);
      }),
    );

    // Custom logic
    return data.updateSession;
  }

  async deleteSessionByPk(selectionSet: string[], id: string) {
    const session = await this.sessionRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(session);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Session (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateSessionByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Session, id);
    // Custom logic
    return data.updateSessionByPk;
  }

  async aggregateSession(
    selectionSet: string[],
    where: SessionBoolExp,
    orderBy?: Array<SessionOrderBy>,
    distinctOn?: Array<SessionSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'sessionAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.sessionAggregate;
  }
}
