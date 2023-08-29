import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { BankInfoRepository, BankInfo } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  BankInfoInsertInput,
  BankInfoOnConflict,
  BankInfoBoolExp,
  BankInfoOrderBy,
  BankInfoSelectColumn,
  BankInfoSetInput,
  BankInfoUpdates,
  BankInfoPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class BankInfosService extends RequestContext {
  private readonly logger = new Logger(BankInfosService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly bankInfoRepository: BankInfoRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: BankInfoInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(bankInfo: BankInfo) {
    if (bankInfo.deletedAt) throw new NotFoundException(`BankInfo was deleted on ${bankInfo.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === bankInfo.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: BankInfoSetInput, bankInfo: BankInfo) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (bankInfo.deletedAt) throw new NotFoundException(`BankInfo was deleted on ${bankInfo.deletedAt}.`);
    if (bankInfo.hiddenAt) throw new NotFoundException('BankInfo must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === bankInfo.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return bankInfo.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: BankInfoSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: BankInfoInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertBankInfoOne(selectionSet: string[], object: BankInfoInsertInput, onConflict?: BankInfoOnConflict) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert BankInfo.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
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
    where: BankInfoBoolExp,
    orderBy?: Array<BankInfoOrderBy>,
    distinctOn?: Array<BankInfoSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertBankInfo(selectionSet: string[], objects: Array<BankInfoInsertInput>, onConflict?: BankInfoOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert BankInfo.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
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

  async updateBankInfoMany(selectionSet: string[], updates: Array<BankInfoUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const bankInfos = await this.bankInfoRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(
      updates.map(async (update) => {
        const bankInfo = bankInfos.find((bankInfo) => bankInfo.id === update.where.id._eq);
        if (!bankInfo) throw new NotFoundException(`BankInfo (${update.where.id._eq}) was not found.`);

        const canUpdate = await this.checkPermsUpdate(update._set, bankInfo);
        if (!canUpdate)
          throw new ForbiddenException(`You are not allowed to update BankInfo (${update.where.id._eq}).`);

        const arePropsValid = await this.checkPropsConstraints(update._set);
        if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
      }),
    );

    const data = await this.hasuraService.updateMany('updateBankInfoMany', selectionSet, updates);

    await Promise.all(
      bankInfos.map(async (bankInfo) => {
        const update = updates.find((update) => update.where.id._eq === bankInfo.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.BankInfo, bankInfo, update._set);
      }),
    );

    // Custom logic
    return data.updateBankInfoMany;
  }

  async updateBankInfoByPk(selectionSet: string[], pkColumns: BankInfoPkColumnsInput, _set: BankInfoSetInput) {
    const bankInfo = await this.bankInfoRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, bankInfo);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update BankInfo (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateBankInfoByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.BankInfo, bankInfo, _set);

    // Custom logic
    return data.updateBankInfoByPk;
  }

  async deleteBankInfo(selectionSet: string[], where: BankInfoBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const bankInfos = await this.bankInfoRepository.findByIds(where.id._in);

    await Promise.all(
      bankInfos.map(async (bankInfo) => {
        const canDelete = await this.checkPermsDelete(bankInfo);
        if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BankInfo (${bankInfo.id}).`);
      }),
    );

    const data = await this.hasuraService.update('updateBankInfo', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      bankInfos.map(async (bankInfo) => {
        await this.logsService.deleteLog(EntityName.BankInfo, bankInfo.id);
      }),
    );

    // Custom logic
    return data.updateBankInfo;
  }

  async deleteBankInfoByPk(selectionSet: string[], id: string) {
    const bankInfo = await this.bankInfoRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(bankInfo);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete BankInfo (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateBankInfoByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.BankInfo, id);
    // Custom logic
    return data.updateBankInfoByPk;
  }

  async aggregateBankInfo(
    selectionSet: string[],
    where: BankInfoBoolExp,
    orderBy?: Array<BankInfoOrderBy>,
    distinctOn?: Array<BankInfoSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'bankInfoAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.bankInfoAggregate;
  }
}
