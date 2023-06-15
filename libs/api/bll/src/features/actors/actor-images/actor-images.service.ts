import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActorImageRepository, ActorImage } from '@okampus/api/dal';
import { EntityName, ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ActorImagesService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actorImageRepository: ActorImageRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['ActorImageInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const actorImage = await this.actorImageRepository.findOneOrFail(id);
    if (actorImage.deletedAt) throw new NotFoundException(`ActorImage was deleted on ${actorImage.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['ActorImageSetInput'], actorImage: ActorImage) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (actorImage.deletedAt) throw new NotFoundException(`ActorImage was deleted on ${actorImage.deletedAt}.`);
    if (actorImage.hiddenAt) throw new NotFoundException('ActorImage must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return actorImage.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['ActorImageSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['ActorImageInsertInput']) {
    // Custom logic
    return true;
  }

  async insertActorImageOne(
    selectionSet: string[],
    object: ValueTypes['ActorImageInsertInput'],
    onConflict?: ValueTypes['ActorImageOnConflict']
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert ActorImage.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertActorImageOne', selectionSet, object, onConflict);

    const actorImage = await this.actorImageRepository.findOneOrFail(data.insertActorImageOne.id);
    await this.logsService.createLog(EntityName.ActorImage, actorImage);

    // Custom logic
    return data.insertActorImageOne;
  }

  async findActorImage(
    selectionSet: string[],
    where: ValueTypes['ActorImageBoolExp'],
    orderBy?: Array<ValueTypes['ActorImageOrderBy']>,
    distinctOn?: Array<ValueTypes['ActorImageSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('actorImage', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.actorImage;
  }

  async findActorImageByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('actorImageByPk', selectionSet, { id });
    return data.actorImageByPk;
  }

  async updateActorImageByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['ActorImagePkColumnsInput'],
    _set: ValueTypes['ActorImageSetInput']
  ) {
    const actorImage = await this.actorImageRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, actorImage);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update ActorImage (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateActorImageByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.ActorImage, actorImage, _set);

    // Custom logic
    return data.updateActorImageByPk;
  }

  async deleteActorImageByPk(selectionSet: string[], pkColumns: ValueTypes['ActorImagePkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ActorImage (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateActorImageByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.ActorImage, pkColumns.id);
    // Custom logic
    return data.updateActorImageByPk;
  }

  async aggregateActorImage(
    selectionSet: string[],
    where: ValueTypes['ActorImageBoolExp'],
    orderBy?: Array<ValueTypes['ActorImageOrderBy']>,
    distinctOn?: Array<ValueTypes['ActorImageSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'actorImageAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.actorImageAggregate;
  }
}
