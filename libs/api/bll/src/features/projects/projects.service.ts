import { RequestContext } from '../../shards/abstract/request-context';
import { HasuraService } from '../../global/graphql/hasura.service';
import { LogsService } from '../logs/logs.service';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ProjectRepository, Project } from '@okampus/api/dal';
import { EntityName, AdminPermissions } from '@okampus/shared/enums';

import { EntityManager } from '@mikro-orm/core';

import type {
  ProjectInsertInput,
  ProjectOnConflict,
  ProjectBoolExp,
  ProjectOrderBy,
  ProjectSelectColumn,
  ProjectSetInput,
  ProjectUpdates,
  ProjectPkColumnsInput,
} from '@okampus/shared/graphql';

@Injectable()
export class ProjectsService extends RequestContext {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly hasuraService: HasuraService,
    private readonly logsService: LogsService,
    private readonly projectRepository: ProjectRepository,
  ) {
    super();
  }

  checkPermsCreate(props: ProjectInsertInput) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Create props cannot be empty.');

    // Custom logic
    return true;
  }

  checkPermsDelete(project: Project) {
    if (project.deletedAt) throw new NotFoundException(`Project was deleted on ${project.deletedAt}.`);
    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.DeleteTenantEntities) && role.tenant?.id === project.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return false;
  }

  checkPermsUpdate(props: ProjectSetInput, project: Project) {
    if (Object.keys(props).length === 0) throw new BadRequestException('Update props cannot be empty.');

    if (project.deletedAt) throw new NotFoundException(`Project was deleted on ${project.deletedAt}.`);
    if (project.hiddenAt) throw new NotFoundException('Project must be unhidden before it can be updated.');

    if (
      this.requester()
        .adminRoles.getItems()
        .some(
          (role) =>
            role.permissions.includes(AdminPermissions.ManageTenantEntities) && role.tenant?.id === project.tenant?.id,
        )
    )
      return true;

    // Custom logic
    return project.createdBy?.id === this.requester().id;
  }

  checkPropsConstraints(props: ProjectSetInput) {
    this.hasuraService.checkForbiddenFields(props);

    // Custom logic
    return true;
  }

  checkCreateRelationships(props: ProjectInsertInput) {
    // Custom logic
    props.tenantId = this.tenant().id;
    props.createdById = this.requester().id;

    return true;
  }

  async insertProjectOne(selectionSet: string[], object: ProjectInsertInput, onConflict?: ProjectOnConflict) {
    const canCreate = this.checkPermsCreate(object);
    if (!canCreate) throw new ForbiddenException('You are not allowed to insert Project.');

    const arePropsValid = this.checkPropsConstraints(object);
    if (!arePropsValid) throw new BadRequestException('Props are not valid.');

    const areRelationshipsValid = this.checkCreateRelationships(object);
    if (!areRelationshipsValid) throw new BadRequestException('Relationships are not valid.');

    selectionSet = [...selectionSet.filter((field) => field !== 'id'), 'id'];
    const data = await this.hasuraService.insertOne('insertProjectOne', selectionSet, object, onConflict);

    const project = await this.projectRepository.findOneOrFail(data.insertProjectOne.id);
    await this.logsService.createLog(EntityName.Project, project);

    // Custom logic
    return data.insertProjectOne;
  }

  async findProject(
    selectionSet: string[],
    where: ProjectBoolExp,
    orderBy?: Array<ProjectOrderBy>,
    distinctOn?: Array<ProjectSelectColumn>,
    limit?: number,
    offset?: number,
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

  async insertProject(selectionSet: string[], objects: Array<ProjectInsertInput>, onConflict?: ProjectOnConflict) {
    for (const object of objects) {
      const canCreate = await this.checkPermsCreate(object);
      if (!canCreate) throw new ForbiddenException('You are not allowed to insert Project.');

      const arePropsValid = await this.checkPropsConstraints(object);
      if (!arePropsValid) throw new BadRequestException('Props are not valid.');

      const areRelationshipsValid = this.checkCreateRelationships(object);
      if (!areRelationshipsValid) throw new BadRequestException('Create relationships are not valid.');
    }

    selectionSet = [...selectionSet.filter((field) => field !== 'returning.id'), 'returning.id'];
    const data = await this.hasuraService.insert('insertProject', selectionSet, objects, onConflict);

    for (const inserted of data.insertProject.returning) {
      const project = await this.projectRepository.findOneOrFail(inserted.id);
      await this.logsService.createLog(EntityName.Project, project);
    }

    // Custom logic
    return data.insertProject;
  }

  async updateProjectMany(selectionSet: string[], updates: Array<ProjectUpdates>) {
    const areWheresCorrect = this.hasuraService.checkUpdates(updates);
    if (!areWheresCorrect) throw new BadRequestException('Where must only contain { id: { _eq: <id> } } in updates.');

    const projects = await this.projectRepository.findByIds(updates.map((update) => update.where.id._eq));
    for (const update of updates) {
      const project = projects.find((project) => project.id === update.where.id._eq);
      if (!project) throw new NotFoundException(`Project (${update.where.id._eq}) was not found.`);

      const canUpdate = this.checkPermsUpdate(update._set, project);
      if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Project (${update.where.id._eq}).`);

      const arePropsValid = this.checkPropsConstraints(update._set);
      if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(update._set)}.`);
    }

    const data = await this.hasuraService.updateMany('updateProjectMany', selectionSet, updates);

    await Promise.all(
      projects.map(async (project) => {
        const update = updates.find((update) => update.where.id._eq === project.id);
        if (!update) return;
        await this.logsService.updateLog(EntityName.Project, project, update._set);
      }),
    );

    // Custom logic
    return data.updateProjectMany;
  }

  async updateProjectByPk(selectionSet: string[], pkColumns: ProjectPkColumnsInput, _set: ProjectSetInput) {
    const project = await this.projectRepository.findOneOrFail(pkColumns.id);

    const canUpdate = this.checkPermsUpdate(_set, project);
    if (!canUpdate) throw new ForbiddenException(`You are not allowed to update Project (${pkColumns.id}).`);

    const arePropsValid = this.checkPropsConstraints(_set);
    if (!arePropsValid) throw new BadRequestException(`Props are not valid in ${JSON.stringify(_set)}.`);

    const data = await this.hasuraService.updateByPk('updateProjectByPk', selectionSet, pkColumns, _set);

    await this.logsService.updateLog(EntityName.Project, project, _set);

    // Custom logic
    return data.updateProjectByPk;
  }

  async deleteProject(selectionSet: string[], where: ProjectBoolExp) {
    const isWhereCorrect = this.hasuraService.checkDeleteWhere(where);
    if (!isWhereCorrect)
      throw new BadRequestException('Where must only contain { id: { _in: <Array<id>> } } in delete.');

    const projects = await this.projectRepository.findByIds(where.id._in);
    for (const project of projects) {
      const canDelete = this.checkPermsDelete(project);
      if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Project (${project.id}).`);
    }

    const data = await this.hasuraService.update('updateProject', selectionSet, where, {
      deletedAt: new Date().toISOString(),
    });

    await Promise.all(
      projects.map(async (project) => {
        await this.logsService.deleteLog(EntityName.Project, project.id);
      }),
    );

    // Custom logic
    return data.updateProject;
  }

  async deleteProjectByPk(selectionSet: string[], id: string) {
    const project = await this.projectRepository.findOneOrFail(id);

    const canDelete = this.checkPermsDelete(project);
    if (!canDelete) throw new ForbiddenException(`You are not allowed to delete Project (${id}).`);

    const data = await this.hasuraService.updateByPk(
      'updateProjectByPk',
      selectionSet,
      { id },
      {
        deletedAt: new Date().toISOString(),
      },
    );

    await this.logsService.deleteLog(EntityName.Project, id);
    // Custom logic
    return data.updateProjectByPk;
  }

  async aggregateProject(
    selectionSet: string[],
    where: ProjectBoolExp,
    orderBy?: Array<ProjectOrderBy>,
    distinctOn?: Array<ProjectSelectColumn>,
    limit?: number,
    offset?: number,
  ) {
    // Custom logic
    const data = await this.hasuraService.aggregate(
      'projectAggregate',
      selectionSet,
      where,
      orderBy,
      distinctOn,
      limit,
      offset,
    );
    return data.projectAggregate;
  }
}
