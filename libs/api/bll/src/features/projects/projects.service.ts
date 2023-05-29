import { RequestContext } from '../../shards/abstract/request-context';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HasuraService } from '../../global/graphql/hasura.service';
import { BadRequestException, Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ProjectRepository } from '@okampus/api/dal';
import type { ValueTypes } from '@okampus/shared/graphql';

@Injectable()
export class ProjectsService extends RequestContext {
  constructor(private readonly projectRepository: ProjectRepository, private readonly hasuraService: HasuraService) {
    super();
  }

  validateProps(props: ValueTypes['ProjectInsertInput']) {
    // Custom logic
    return true;
  }

  async insertProject(
    selectionSet: string[],
    objects: Array<ValueTypes['ProjectInsertInput']>,
    onConflict?: ValueTypes['ProjectOnConflict'],
    insertOne?: boolean
  ) {
    const arePropsValid = await objects.every((object) => this.validateProps(object));
    if (!arePropsValid) throw new BadRequestException('Cannot insert Project with invalid props.');

    const data = await this.hasuraService.insert('insertProject', selectionSet, objects, onConflict, insertOne);
    // Custom logic
    return data.insertProject;
  }

  async updateProject(
    selectionSet: string[],
    where: ValueTypes['ProjectBoolExp'],
    _set: ValueTypes['ProjectSetInput']
  ) {
    const arePropsValid = this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Project with invalid props.');

    const data = await this.hasuraService.update('updateProject', selectionSet, where, _set);
    // Custom logic
    return data.updateProject;
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
    const arePropsValid = await this.validateProps(_set);
    if (!arePropsValid) throw new BadRequestException('Cannot update Project with invalid props.');

    const data = await this.hasuraService.updateByPk('updateProjectByPk', selectionSet, pkColumns, _set);
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
