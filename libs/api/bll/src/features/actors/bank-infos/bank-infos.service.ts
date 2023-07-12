import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BankInfoRepository, BankInfo } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class BankInfosService extends RequestContext {
  private readonly logger = new Logger(BankInfosService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly bankInfoRepository: BankInfoRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['BankInfoInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(bankInfo: BankInfo) {
    if (bankInfo.deletedAt) throw new NotFoundException(`BankInfo was deleted on ${bankInfo.deletedAt}.`);
    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === bankInfo.tenant?.id
      )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['BankInfoSetInput'], bankInfo: BankInfo) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (bankInfo.deletedAt) throw new NotFoundException(`BankInfo was deleted on ${bankInfo.deletedAt}.`);
    if (bankInfo.hiddenAt) throw new NotFoundException('BankInfo must be unhidden before it can be updated.');

    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === bankInfo.tenant?.id
      )
    )
      return true;

    // Custom logic
    return bankInfo.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['BankInfoSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['BankInfoInsertInput']) {
    // Custom logic

    return true;
  }

  async insertBankInfoOne(
    selectionSet: string[],
    object: ValueTypes['BankInfoInsertInput'],
    onConflict?: ValueTypes['BankInfoOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert BankInfo.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertBankInfoOne', selectionSet, object, onConflict);

    const bankInfo = await this.bankInfoRepository.findOneOrFail(data.insertBankInfoOne.id);
    await this.logsService.createLog(EntityName.BankInfo, bankInfo);

    // Custom logic
    return data.insertBankInfoOne;
  }

  async findBankInfo(
    selectionSet: string[],
    where: ValueTypes['BankInfoBoolExp'],
    orderBy?: Array<ValueTypes['BankInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['BankInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('bankInfo', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.bankInfo;
  }

  async findBankInfoByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('bankInfoByPk', selectionSet, { id });
    return data.bankInfoByPk;
  }

  async insertBankInfo(
    selectionSet: string[],
    objects: Array<ValueTypes['BankInfoInsertInput']>,
    onConflict?: ValueTypes['BankInfoOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert BankInfo.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertBankInfo', selectionSet, objects, onConflict);

    for (const inserted of data.insertBankInfo.returning) {
      const bankInfo = await this.bankInfoRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.BankInfo, bankInfo);
    }

    // Custom logic
    return data.insertBankInfo;
  }

  async updateBankInfoMany(selectionSet: string[], updates: Array<ValueTypes['BankInfoUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const bankInfos = await this.bankInfoRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const bankInfo = bankInfos.find((bankInfo) => bankInfo.id === update.where.id._eq);
      if (!bankInfo) throw new NotFoundException(`BankInfo (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, bankInfo);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BankInfo (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateBankInfoMany', selectionSet, updates);

    await Promise.all(
      bankInfos.map(async (bankInfo) => {
        const update = updates.find((update) => update.where.id._eq === bankInfo.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.BankInfo, bankInfo, update._set);
      })
    );

    // Custom logic
    return data.updateBankInfoMany;
  }

  async updateBankInfoByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['BankInfoPkColumnsInput'],
    _set: ValueTypes['BankInfoSetInput']
  ) {
    const bankInfo = await this.bankInfoRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, bankInfo);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BankInfo (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateBankInfoByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.BankInfo, bankInfo, _set);

    // Custom logic
    return data.updateBankInfoByPk;
  }

  async deleteBankInfo(selectionSet: string[], where: ValueTypes['BankInfoBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const bankInfos = await this.bankInfoRepository.findByIds(where.id._in);
    for (const bankInfo of bankInfos) {
      const canDelete = this.checkPermsDelete(bankInfo);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BankInfo (${bankInfo.id}).`);
    }

    const data = await this.hasuraService.update('updateBankInfo', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      bankInfos.map(async (bankInfo) => {
        await this.logsService.deleteLog(EntityName.BankInfo, bankInfo.id);
      })
    );

    // Custom logic
    return data.updateBankInfo;
  }

  async deleteBankInfoByPk(selectionSet: string[], pkColumns: ValueTypes['BankInfoPkColumnsInput']) {
    const bankInfo = await this.bankInfoRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(bankInfo);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BankInfo (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateBankInfoByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.BankInfo, pkColumns.id);
    // Custom logic
    return data.updateBankInfoByPk;
  }

  async aggregateBankInfo(
    selectionSet: string[],
    where: ValueTypes['BankInfoBoolExp'],
    orderBy?: Array<ValueTypes['BankInfoOrderBy']>,
    distinctOn?: Array<ValueTypes['BankInfoSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'bankInfoAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.bankInfoAggregate;
  }
}
