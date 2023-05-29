import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ActorsService extends RequestContext {
  constructor(private readonly actorRepository: ActorRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['ActorInsertInput']) {
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async insertActor(
    selectionSet: string[],
    objects: Array<ValueTypes['ActorInsertInput']>,
    onConflict?: ValueTypes['ActorOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Actor with invalid props.');

    const data = await this.hasuraService.insert('insertActor', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertActor;
  }

  async updateActor(selectionSet: string[], where: ValueTypes['ActorBoolExp'], _set: ValueTypes['ActorSetInput']) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Actor with invalid props.');

    const data = await this.hasuraService.update('updateActor', selectionSet, where, _set);
    // Custom logic
    return data.updateActor;
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
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Actor with invalid props.');

    const data = await this.hasuraService.updateByPk('updateActorByPk', selectionSet, pkColumns, _set);
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
