import { RequestContext } from '../../../shards/abstract/request-context';
import { HasuraService } from '../../../global/graphql/hasura.service';
import { LogsService } from '../../../global/logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';

import { SocialRepository } from '@okampus/api/dal';
import { EntityName } from '@okampus/shared/enums';
import { mergeUnique, canAdminDelete, canAdminManage } from '@okampus/shared/utils';

import { EntityManager } from '@mikro-orm/core';

import type { Social } from '@okampus/api/dal';
import type {
  SocialInsertInput,
  SocialOnConflict,
  SocialBoolExp,
  SocialOrderBy,
  SocialSelectColumn,
  SocialSetInput,
  SocialUpdates,
  SocialPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class SocialsService extends RequestContext {
  private readonly logger = new Logger(SocialsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly socialRepository: SocialRepository,
  ) {
    super();
  }

  async checkPermsCreate(props: SocialInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, { tenantScope: this.tenant() }))) return true;

    // Custom logic
    return false;
  }

  async checkPermsDelete(social: Social) {
    if (social.deletedAt) throw new NotFoundException(`Social was deleted on ${social.deletedAt}.`);
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminDelete(adminRole, social))) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: SocialSetInput, social: Social) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (social.deletedAt) throw new NotFoundException(`Social was deleted on ${social.deletedAt}.`);
    if (social.hiddenAt) throw new NotFoundException('Social must be unhidden before it can be updated.');
    const requesterRoles = this.requester().adminRoles.getItems();
    if (requesterRoles.some((adminRole) => canAdminManage(adminRole, social))) return true;

    // Custom logic
    return social.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: SocialSetInput) {
    this.hasuraService.checkForbiddenFields(props);
    

    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: SocialInsertInput) {
    // Custom logic
    props.tenantScopeId = this.tenant().id;
    props.createdById = this.requester().id;

    
    

    return true;
  }

  async insertSocialOne(
    selectionSet: string[],
    object: SocialInsertInput,
    onConflict?: SocialOnConflict,
  ) {
    const canCreate = await this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Social.');

    const arePropsValid = await this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = await this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = mergeUnique(selectionSet, ['id']);
    const data = await this.hasuraService.insertOne('insertSocialOne', selectionSet, object, onConflict);

    const social = await this.socialRepository.findOneOrFail(data.insertSocialOne.id);
    await this.logsService.createLog(EntityName.Social, social);

    // Custom logic
    return data.insertSocialOne;
  }

  async findSocial(
    selectionSet: string[],
    where: SocialBoolExp,
    orderBy?: Array<SocialOrderBy>,
    distinctOn?: Array<SocialSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.find('social', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.social;
  }

  async findSocialByPk(
    selectionSet: string[],
     id: string, 
  ) {
    // Custom logic
    const data = await this.hasuraService.findByPk('socialByPk', selectionSet, {  id,  });
    return data.socialByPk;
  }

  async insertSocial(
    selectionSet: string[],
    objects: Array<SocialInsertInput>,
    onConflict?: SocialOnConflict,
  ) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Social.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = await this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = mergeUnique(selectionSet, ['returning.id']);
    const data = await this.hasuraService.insert('insertSocial', selectionSet, objects, onConflict);

    for (const inserted of data.insertSocial.returning) {
      const social = await this.socialRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Social, social);
    }

    // Custom logic
    return data.insertSocial;
  }

  async updateSocialMany(
    selectionSet: string[],
    updates: Array<SocialUpdates>,
  ) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const socials = await this.socialRepository.findByIds(updates.map((update) => update.where.id._eq));

    await Promise.all(updates.map(async (update) => {
      const social = socials.find((social) => social.id === update.where.id._eq);
      if (!social) throw new NotFoundException(`Social (${update.where.id._eq}) was not found.`);

      const canUpdate = await this.checkPermsUpdate(update._set, social);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Social (${update.where.id._eq}).`);

      const arePropsValid = await this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }));

    const data = await this.hasuraService.updateMany('updateSocialMany', selectionSet, updates);

    await Promise.all(socials.map(async (social) => {
      const update = updates.find((update) => update.where.id._eq === social.id)
      if (!update) return;
      await this.logsService.updateLog(EntityName.Social, social, update._set);
    }));

    // Custom logic
    return data.updateSocialMany;
  }

  async updateSocialByPk(
    selectionSet: string[],
    pkColumns: SocialPkColumnsInput,
    _set: SocialSetInput,
  ) {
    const social = await this.socialRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, social);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Social (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateSocialByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Social, social, _set);

    // Custom logic
    return data.updateSocialByPk;
  }

  async deleteSocial(
    selectionSet: string[],
    where: SocialBoolExp,
  ) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect) throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const socials = await this.socialRepository.findByIds(where.id._in);

    await Promise.all(socials.map(async (social) => {
      const canDelete = await this.checkPermsDelete(social);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Social (${social.id}).`);
    }));

    const data = await this.hasuraService.update('updateSocial', selectionSet, where, { deletedAt: new Date().toISOString() });

    await Promise.all(socials.map(async (social) => {
      await this.logsService.deleteLog(EntityName.Social, social.id);
    }));

    // Custom logic
    return data.updateSocial;
  }

  async deleteSocialByPk(
    selectionSet: string[],
    id: string,
  ) {
    const social = await this.socialRepository.findOneOrFail(id);

    const canDelete = await this.checkPermsDelete(social);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Social (${id}).`);

    const data = await this.hasuraService.updateByPk('updateSocialByPk', selectionSet, { id }, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(EntityName.Social, id);
    // Custom logic
    return data.updateSocialByPk;
  }

  async aggregateSocial(
    selectionSet: string[],
    where: SocialBoolExp,
    orderBy?: Array<SocialOrderBy>,
    distinctOn?: Array<SocialSelectColumn>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate('socialAggregate', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.socialAggregate;
  }
}