import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { TenantMemberRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { TenantMember } from '@okampus/api/dal';
import type {
  TenantMemberInsertInput,
  TenantMemberOnConflict,
  TenantMemberBoolExp,
  TenantMemberOrderBy,
  TenantMemberSelectColumn,
  TenantMemberSetInput,
  TenantMemberUpdates,
  TenantMemberPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class TenantMembersService extends RequestContext {
  private readonly logger = new Logger(TenantMembersService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly tenantMemberRepository: TenantMemberRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: TenantMemberInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(tenantMember: TenantMember) {
    if (tenantMember.deletedAt) throw new NotFoundException(`TenantMember was deleted on ${tenantMember.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canDeleteTenantEntities)) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: TenantMemberSetInput, tenantMember: TenantMember) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (tenantMember.deletedAt) throw new NotFoundException(`TenantMember was deleted on ${tenantMember.deletedAt}.`);
    if (tenantMember.hiddenAt) throw new NotFoundException('TenantMember must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => adminRole.canManageTenantEntities)) return true;

    // Custom logic
    return tenantMember.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: TenantMemberSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: TenantMemberInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertTenantMemberOne(
    selectionSet: string[],
    object: TenantMemberInsertInput,
    onConflict?: TenantMemberOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantMember.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertTenantMemberOne', selectionSet, object, onConflict);

    const tenantMember = await this.tenantMemberRepository.findOneOrFail(data.insertTenantMemberOne.id);
    await this.logsService.createLog(EntityName.TenantMember, tenantMember);

    // Custom logic
    return data.insertTenantMemberOne;
  }

  async findTenantMember(
    selectionSet: string[],
    where: TenantMemberBoolExp,
    orderBy?: Array<TenantMemberOrderBy>,
    distinctOn?: Array<TenantMemberSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('tenantMember', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.tenantMember;
  }

  async findTenantMemberByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('tenantMemberByPk', selectionSet, { id });
    return data.tenantMemberByPk;
  }

  async insertTenantMember(
    selectionSet: string[],
    objects: Array<TenantMemberInsertInput>,
    onConflict?: TenantMemberOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert TenantMember.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertTenantMember', selectionSet, objects, onConflict);

    for (const inserted of data.insertTenantMember.returning) {
      const tenantMember = await this.tenantMemberRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.TenantMember, tenantMember);
    }

    // Custom logic
    return data.insertTenantMember;
  }

  async updateTenantMemberMany(selectionSet: string[], updates: Array<TenantMemberUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const tenantMembers = await this.tenantMemberRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const tenantMember = tenantMembers.find((tenantMember) => tenantMember.id === update.where.id._eq);
        if (!tenantMember) throw new NotFoundException(`TenantMember (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, tenantMember);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update TenantMember (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateTenantMemberMany', selectionSet, updates);

    await Promise.all(
      tenantMembers.map(async (tenantMember) => {
        const update = updates.find((update) => update.where.id._eq === tenantMember.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.TenantMember, tenantMember, update._set);
      }),
    );

    // Custom logic
    return data.updateTenantMemberMany;
  }

  async updateTenantMemberByPk(
    selectionSet: string[],
    pkColumns: TenantMemberPkColumnsInput,
    _set: TenantMemberSetInput,
  ) {
    const tenantMember = await this.tenantMemberRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, tenantMember);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update TenantMember (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateTenantMemberByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.TenantMember, tenantMember, _set);

    // Custom logic
    return data.updateTenantMemberByPk;
  }

  async deleteTenantMember(selectionSet: string[], where: TenantMemberBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const tenantMembers = await this.tenantMemberRepository.findByIds(where.id._in);

    await Promise.all(
      tenantMembers.map(async (tenantMember) => {
        const canDelete = await this.checkPermsDelete(tenantMember);
        if (!canDelete)
          throw new ForbiddenException(`You are not allowed to delete TenantMember (${tenantMember.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateTenantMember', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      tenantMembers.map(async (tenantMember) => {
        await this.logsService.deleteLog(EntityName.TenantMember, tenantMember.id);
      }),
    );

    // Custom logic
    return data.updateTenantMember;
  }

  async deleteTenantMemberByPk(selectionSet: string[], id: string) {
    const tenantMember = await this.tenantMemberRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(tenantMember);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete TenantMember (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateTenantMemberByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.TenantMember, id);
    // Custom logic
    return data.updateTenantMemberByPk;
  }

  async aggregateTenantMember(
    selectionSet: string[],
    where: TenantMemberBoolExp,
    orderBy?: Array<TenantMemberOrderBy>,
    distinctOn?: Array<TenantMemberSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'tenantMemberAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.tenantMemberAggregate;
  }
}
