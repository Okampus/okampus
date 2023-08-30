import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { PoleRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { canAdminCreate, canAdminDelete, canAdminUpdate } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Pole } from '@okampus/api/dal';
import type {
  PoleInsertInput,
  PoleOnConflict,
  PoleBoolExp,
  PoleOrderBy,
  PoleSelectColumn,
  PoleSetInput,
  PoleUpdates,
  PolePkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class PolesService extends RequestContext {
  private readonly logger = new Logger(PolesService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly poleRepository: PoleRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: PoleInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminCreate(adminRole, this.tenant()))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(pole: Pole) {
    if (pole.deletedAt) throw new NotFoundException(`Pole was deleted on ${pole.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, pole))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: PoleSetInput, pole: Pole) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (pole.deletedAt) throw new NotFoundException(`Pole was deleted on ${pole.deletedAt}.`);
    if (pole.hiddenAt) throw new NotFoundException('Pole must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminUpdate(adminRole, pole))) return true;

    // Custom logic
    return pole.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: PoleSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: PoleInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertPoleOne(selectionSet: string[], object: PoleInsertInput, onConflict?: PoleOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Pole.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertPoleOne', selectionSet, object, onConflict);

    const pole = await this.poleRepository.findOneOrFail(data.insertPoleOne.id);
    await this.logsService.createLog(EntityName.Pole, pole);

    // Custom logic
    return data.insertPoleOne;
  }

  async findPole(
    selectionSet: string[],
    where: PoleBoolExp,
    orderBy?: Array<PoleOrderBy>,
    distinctOn?: Array<PoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('pole', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.pole;
  }

  async findPoleByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('poleByPk', selectionSet, { id });
    return data.poleByPk;
  }

  async insertPole(selectionSet: string[], objects: Array<PoleInsertInput>, onConflict?: PoleOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Pole.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertPole', selectionSet, objects, onConflict);

    for (const inserted of data.insertPole.returning) {
      const pole = await this.poleRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Pole, pole);
    }

    // Custom logic
    return data.insertPole;
  }

  async updatePoleMany(selectionSet: string[], updates: Array<PoleUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const poles = await this.poleRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const pole = poles.find((pole) => pole.id === update.where.id._eq);
        if (!pole) throw new NotFoundException(`Pole (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, pole);
        if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Pole (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updatePoleMany', selectionSet, updates);

    await Promise.all(
      poles.map(async (pole) => {
        const update = updates.find((update) => update.where.id._eq === pole.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Pole, pole, update._set);
      }),
    );

    // Custom logic
    return data.updatePoleMany;
  }

  async updatePoleByPk(selectionSet: string[], pkColumns: PolePkColumnsInput, _set: PoleSetInput) {
    const pole = await this.poleRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, pole);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Pole (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updatePoleByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Pole, pole, _set);

    // Custom logic
    return data.updatePoleByPk;
  }

  async deletePole(selectionSet: string[], where: PoleBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const poles = await this.poleRepository.findByIds(where.id._in);

    await Promise.all(
      poles.map(async (pole) => {
        const canDelete = await this.checkPermsDelete(pole);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Pole (${pole.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updatePole', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      poles.map(async (pole) => {
        await this.logsService.deleteLog(EntityName.Pole, pole.id);
      }),
    );

    // Custom logic
    return data.updatePole;
  }

  async deletePoleByPk(selectionSet: string[], id: string) {
    const pole = await this.poleRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(pole);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Pole (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updatePoleByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Pole, id);
    // Custom logic
    return data.updatePoleByPk;
  }

  async aggregatePole(
    selectionSet: string[],
    where: PoleBoolExp,
    orderBy?: Array<PoleOrderBy>,
    distinctOn?: Array<PoleSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'poleAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.poleAggregate;
  }
}
