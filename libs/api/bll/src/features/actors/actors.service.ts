import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorRepository, Actor } from '@okampus/api/dal';
import { ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ActorsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actorRepository: ActorRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['ActorInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const actor = await this.actorRepository.findOneOrFail(id);
    if (actor.deletedAt) throw new NotFoundException(`Actor was deleted on ${actor.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['ActorSetInput'], actor: Actor) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (actor.deletedAt) throw new NotFoundException(`Actor was deleted on ${actor.deletedAt}.`);
    if (actor.hiddenAt) throw new NotFoundException('Actor must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return actor.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['ActorSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['ActorInsertInput']) {
    // Custom logic
    return true;
  }

  async insertActor(
    selectionSet: string[],
    objects: Array<ValueTypes['ActorInsertInput']>,
    onConflict?: ValueTypes['ActorOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Actor.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Actor.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertActor', selectionSet, objects, onConflict, insertOne);

    const actor = await this.actorRepository.findOneOrFail(data.insertActor[0].id);
    await this.logsService.createLog(actor);

    // Custom logic
    return data.insertActor;
  }

  async findActor(
    selectionSet: string[],
    where: ValueTypes['ActorBoolExp'],
    orderBy?: Array<ValueTypes['ActorOrderBy']>,
    distinctOn?: Array<ValueTypes['ActorSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('actor', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actor;
  }

  async findActorByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actorByPk', selectionSet, { id });
    return data.actorByPk;
  }

  async updateActorByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['ActorPkColumnsInput'],
    _set: ValueTypes['ActorSetInput']
  ) {
    const actor = await this.actorRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, actor);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Actor (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(actor, _set);

    // Custom logic
    return data.updateActorByPk;
  }

  async deleteActorByPk(selectionSet: string[], pkColumns: ValueTypes['ActorPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Actor (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(pkColumns.id);
    // Custom logic
    return data.updateActorByPk;
  }

  async aggregateActor(
    selectionSet: string[],
    where: ValueTypes['ActorBoolExp'],
    orderBy?: Array<ValueTypes['ActorOrderBy']>,
    distinctOn?: Array<ValueTypes['ActorSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'actorAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.actorAggregate;
  }
}
