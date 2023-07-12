import { RequestContext } from '../../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { SocialRepository, Social } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class SocialsService extends RequestContext {
  private readonly logger = new Logger(SocialsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly socialRepository: SocialRepository
  ) {
    super();
  }

  checkPermsCreate(props: ValueTypes['SocialInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(social: Social) {
    if (social.deletedAt) throw new NotFoundException(`Social was deleted on ${social.deletedAt}.`);
    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === social.tenant?.id
      )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ValueTypes['SocialSetInput'], social: Social) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (social.deletedAt) throw new NotFoundException(`Social was deleted on ${social.deletedAt}.`);
    if (social.hiddenAt) throw new NotFoundException('Social must be unhidden before it can be updated.');

    if (
      this.requester().adminRoles.some(
        (role) =>
          role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === social.tenant?.id
      )
    )
      return true;

    // Custom logic
    return social.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ValueTypes['SocialSetInput']) {
    this.hasuraService.checkForbiddenFields(props);
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ValueTypes['SocialInsertInput']) {
    // Custom logic

    return true;
  }

  async insertSocialOne(
    selectionSet: string[],
    object: ValueTypes['SocialInsertInput'],
    onConflict?: ValueTypes['SocialOnConflict']
  ) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Social.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertSocialOne', selectionSet, object, onConflict);

    const social = await this.socialRepository.findOneOrFail(data.insertSocialOne.id);
    await this.logsService.createLog(EntityName.Social, social);

    // Custom logic
    return data.insertSocialOne;
  }

  async findSocial(
    selectionSet: string[],
    where: ValueTypes['SocialBoolExp'],
    orderBy?: Array<ValueTypes['SocialOrderBy']>,
    distinctOn?: Array<ValueTypes['SocialSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('social', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.social;
  }

  async findSocialByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('socialByPk', selectionSet, { id });
    return data.socialByPk;
  }

  async insertSocial(
    selectionSet: string[],
    objects: Array<ValueTypes['SocialInsertInput']>,
    onConflict?: ValueTypes['SocialOnConflict']
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Social.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertSocial', selectionSet, objects, onConflict);

    for (const inserted of data.insertSocial.returning) {
      const social = await this.socialRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Social, social);
    }

    // Custom logic
    return data.insertSocial;
  }

  async updateSocialMany(selectionSet: string[], updates: Array<ValueTypes['SocialUpdates']>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const socials = await this.socialRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const social = socials.find((social) => social.id === update.where.id._eq);
      if (!social) throw new NotFoundException(`Social (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, social);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Social (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateSocialMany', selectionSet, updates);

    await Promise.all(
      socials.map(async (social) => {
        const update = updates.find((update) => update.where.id._eq === social.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Social, social, update._set);
      })
    );

    // Custom logic
    return data.updateSocialMany;
  }

  async updateSocialByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['SocialPkColumnsInput'],
    _set: ValueTypes['SocialSetInput']
  ) {
    const social = await this.socialRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, social);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Social (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateSocialByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Social, social, _set);

    // Custom logic
    return data.updateSocialByPk;
  }

  async deleteSocial(selectionSet: string[], where: ValueTypes['SocialBoolExp']) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const socials = await this.socialRepository.findByIds(where.id._in);
    for (const social of socials) {
      const canDelete = this.checkPermsDelete(social);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Social (${social.id}).`);
    }

    const data = await this.hasuraService.update('updateSocial', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      socials.map(async (social) => {
        await this.logsService.deleteLog(EntityName.Social, social.id);
      })
    );

    // Custom logic
    return data.updateSocial;
  }

  async deleteSocialByPk(selectionSet: string[], pkColumns: ValueTypes['SocialPkColumnsInput']) {
    const social = await this.socialRepository.findOneOrFail(pkColumns.id);

    const canDelete = this.checkPermsDelete(social);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Social (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateSocialByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Social, pkColumns.id);
    // Custom logic
    return data.updateSocialByPk;
  }

  async aggregateSocial(
    selectionSet: string[],
    where: ValueTypes['SocialBoolExp'],
    orderBy?: Array<ValueTypes['SocialOrderBy']>,
    distinctOn?: Array<ValueTypes['SocialSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'socialAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.socialAggregate;
  }
}
