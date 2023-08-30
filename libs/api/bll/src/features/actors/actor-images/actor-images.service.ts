import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { Actor, ActorImageRepository } from '@okampus/api/dal';
import { ActorImageType, EntityName } from '@okampus/shared/enums';
import { canAdminCreate, canAdminDelete, canAdminUpdate, mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { ActorImage } from '@okampus/api/dal';
import type {
  ActorImageInsertInput,
  ActorImageOnConflict,
  ActorImageBoolExp,
  ActorImageOrderBy,
  ActorImageSelectColumn,
  ActorImageSetInput,
  ActorImageUpdates,
  ActorImagePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ActorImagesService extends RequestContext {
  private readonly logger = new Logger(ActorImagesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly actorImageRepository: ActorImageRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: ActorImageInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminCreate(adminRole, this.tenant()))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(actorImage: ActorImage) {
    if (actorImage.deletedAt) throw new NotFoundException(`ActorImage was deleted on ${actorImage.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, actorImage))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ActorImageSetInput, actorImage: ActorImage) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (actorImage.deletedAt) throw new NotFoundException(`ActorImage was deleted on ${actorImage.deletedAt}.`);
    if (actorImage.hiddenAt) throw new NotFoundException('ActorImage must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminUpdate(adminRole, actorImage))) return true;

    // Custom logic
    return actorImage.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ActorImageSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ActorImageInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async disableActorImage(type: ActorImageType.Avatar | ActorImageType.Banner, url: string, actorId: string) {
    const actor = await this.em.findOne(Actor, { id: actorId });
    if (actor) {
      actor[type === ActorImageType.Avatar ? 'avatar' : 'banner'] = url;
      await this.em.persistAndFlush(actor);
    }
  }

  async insertActorImageOne(selectionSet: string[], object: ActorImageInsertInput, onConflict?: ActorImageOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert ActorImage.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id', 'type', 'image.url', 'actor.id']);
    const data = await this.hasuraService.insertOne('insertActorImageOne', selectionSet, object, onConflict);

    const actorImage = await this.actorImageRepository.findOneOrFail(data.insertActorImageOne.id);
    await this.logsService.createLog(EntityName.ActorImage, actorImage);

    const type = data.insertActorImageOne.type;
    if (type === ActorImageType.Avatar || type === ActorImageType.Banner)
      await this.disableActorImage(type, data.insertActorImageOne.image.url, data.insertActorImageOne.actor.url);

    // Custom logic
    return data.insertActorImageOne;
  }

  async findActorImage(
    selectionSet: string[],
    where: ActorImageBoolExp,
    orderBy?: Array<ActorImageOrderBy>,
    distinctOn?: Array<ActorImageSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertActorImage(
    selectionSet: string[],
    objects: Array<ActorImageInsertInput>,
    onConflict?: ActorImageOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert ActorImage.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertActorImage', selectionSet, objects, onConflict);

    for (const inserted of data.insertActorImage.returning) {
      const actorImage = await this.actorImageRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.ActorImage, actorImage);
    }

    // Custom logic
    return data.insertActorImage;
  }

  async updateActorImageMany(selectionSet: string[], updates: Array<ActorImageUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const actorImages = await this.actorImageRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const actorImage = actorImages.find((actorImage) => actorImage.id === update.where.id._eq);
        if (!actorImage) throw new NotFoundException(`ActorImage (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, actorImage);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update ActorImage (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateActorImageMany', selectionSet, updates);

    await Promise.all(
      actorImages.map(async (actorImage) => {
        const update = updates.find((update) => update.where.id._eq === actorImage.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.ActorImage, actorImage, update._set);
      }),
    );

    // Custom logic
    return data.updateActorImageMany;
  }

  async updateActorImageByPk(selectionSet: string[], pkColumns: ActorImagePkColumnsInput, _set: ActorImageSetInput) {
    const actorImage = await this.actorImageRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, actorImage);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update ActorImage (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateActorImageByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.ActorImage, actorImage, _set);

    // Custom logic
    return data.updateActorImageByPk;
  }

  async deleteActorImage(selectionSet: string[], where: ActorImageBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const actorImages = await this.actorImageRepository.findByIds(where.id._in);

    await Promise.all(
      actorImages.map(async (actorImage) => {
        const canDelete = await this.checkPermsDelete(actorImage);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ActorImage (${actorImage.id}).`);
      }),
    );

    selectionSet = mergeUnique(selectionSet, ['type', 'actor.id']);
    const data = await this.hasuraService.update('updateActorImage', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    const type = data.updateActorImage.type;
    if (type === ActorImageType.Avatar || type === ActorImageType.Banner)
      await this.disableActorImage(type, '', data.updateActorImage.actor.id);

    await Promise.all(
      actorImages.map(async (actorImage) => {
        await this.logsService.deleteLog(EntityName.ActorImage, actorImage.id);
      }),
    );

    // Custom logic
    return data.updateActorImage;
  }

  async deleteActorImageByPk(selectionSet: string[], id: string) {
    const actorImage = await this.actorImageRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(actorImage);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete ActorImage (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateActorImageByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.ActorImage, id);
    // Custom logic
    return data.updateActorImageByPk;
  }

  async aggregateActorImage(
    selectionSet: string[],
    where: ActorImageBoolExp,
    orderBy?: Array<ActorImageOrderBy>,
    distinctOn?: Array<ActorImageSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'actorImageAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.actorImageAggregate;
  }
}
