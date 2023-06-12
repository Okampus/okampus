import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectRepository, Project } from '@okampus/api/dal';
import { ScopeRole } from '@okampus/shared/enums';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ProjectsService extends RequestContext {
  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly projectRepository: ProjectRepository
  ) {
    super();
  }

  async checkPermsCreate(props: ValueTypes['ProjectInsertInput']) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  async checkPermsDelete(id: string) {
    const project = await this.projectRepository.findOneOrFail(id);
    if (project.deletedAt) throw new NotFoundException(`Project was deleted on ${project.deletedAt}.`);

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return false;
  }

  async checkPermsUpdate(props: ValueTypes['ProjectSetInput'], project: Project) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (project.deletedAt) throw new NotFoundException(`Project was deleted on ${project.deletedAt}.`);
    if (project.hiddenAt) throw new NotFoundException('Project must be unhidden before it can be updated.');

    if (this.requester().scopeRole === ScopeRole.Admin) return true;

    // Custom logic
    return project.createdBy?.id === this.requester().id;
  }

  async checkPropsConstraints(props: ValueTypes['ProjectSetInput']) {
    this.hasuraService.checkForbiddenFields(props);

    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;
    // Custom logic
    return true;
  }

  async checkCreateRelationships(props: ValueTypes['ProjectInsertInput']) {
    // Custom logic
    return true;
  }

  async insertProject(
    selectionSet: string[],
    objects: Array<ValueTypes['ProjectInsertInput']>,
    onConflict?: ValueTypes['ProjectOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await Promise.all(
      objects.map(async (props) => {
        const canCreate = await this.checkPermsCreate(props);
        if (!canCreate) throw new ForbiddenException('You are not allowed to insert Project.');

        const arePropsValid = await this.checkPropsConstraints(props);
        if (!arePropsValid) throw new BadRequestException('Props are not valid.');

        const areRelationshipsValid = await this.checkCreateRelationships(props);
        if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

        return canCreate && arePropsValid && areRelationshipsValid;
      })
    ).then((results) => results.every(Boolean));

    if (!arePropsValid) throw new ForbiddenException('You are not allowed to insert Project.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insert('insertProject', selectionSet, objects, onConflict, insertOne);

    const project = await this.projectRepository.findOneOrFail(data.insertProject[0].id);
    await this.logsService.createLog(project);

    // Custom logic
    return data.insertProject;
  }

  async findProject(
    selectionSet: string[],
    where: ValueTypes['ProjectBoolExp'],
    orderBy?: Array<ValueTypes['ProjectOrderBy']>,
    distinctOn?: Array<ValueTypes['ProjectSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.find('project', selectionSet, where, orderBy, distinctOn, limit, offset);
    return data.project;
  }

  async findProjectByPk(selectionSet: string[], id: string) {
    // Custom logic
    const data = await this.hasuraService.findByPk('projectByPk', selectionSet, { id });
    return data.projectByPk;
  }

  async updateProjectByPk(
    selectionSet: string[],
    pkColumns: ValueTypes['ProjectPkColumnsInput'],
    _set: ValueTypes['ProjectSetInput']
  ) {
    const project = await this.projectRepository.findOneOrFail(pkColumns.id);

    const canUpdate = await this.checkPermsUpdate(_set, project);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Project (${pkColumns.id}).`);

    const arePropsValid = await this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const data = await this.hasuraService.updateByPk('updateProjectByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(project, _set);

    // Custom logic
    return data.updateProjectByPk;
  }

  async deleteProjectByPk(selectionSet: string[], pkColumns: ValueTypes['ProjectPkColumnsInput']) {
    const canDelete = await this.checkPermsDelete(pkColumns.id);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Project (${pkColumns.id}).`);

    const data = await this.hasuraService.updateByPk('updateProjectByPk', selectionSet, pkColumns, {
      deletedAt: new Date().toISOString(),
    });

    await this.logsService.deleteLog(pkColumns.id);
    // Custom logic
    return data.updateProjectByPk;
  }

  async aggregateProject(
    selectionSet: string[],
    where: ValueTypes['ProjectBoolExp'],
    orderBy?: Array<ValueTypes['ProjectOrderBy']>,
    distinctOn?: Array<ValueTypes['ProjectSelectColumn']>,
    limit?: number,
    offset?: number
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'projectAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset
    );
    return data.projectAggregate;
  }
}
