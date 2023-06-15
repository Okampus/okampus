import { RequestContext } from '../../shards/abstract/request-context';
import { loadConfig } from '../../shards/utils/load-config';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { EntityManager } from '@mikro-orm/core';

import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { TeamMemberRepository } from '@okampus/api/dal';
import { GraphQLEnum, isNonNullObject } from '@okampus/shared/utils';

import axios from 'axios';
import type { AxiosInstance } from 'axios';

type Obj = Record<string, unknown>;
interface Fields {
  [key: string]: true | Fields;
}

function selectionSetToObject(selectionSet: string[]): Fields {
  const result: Fields = {};

  for (const field of selectionSet) {
    const deepFields = field.split('.');
    let current = result;
    for (const deepField of deepFields) {
      if (!current[deepField]) current[deepField] = deepField === deepFields.at(-1) ? true : {};
      const field = current[deepField];
      if (typeof field !== 'boolean') current = field;
    }
  }
  return result;
}

function selectionSetObjectToString(fields: Fields): string {
  let result = '';
  for (const key in fields) {
    const value = fields[key];
    result += value === true ? `${key} ` : `${key} { ${selectionSetObjectToString(value)} } `;
  }
  return result.trim();
}

const strigifySelectionSet = (selectionSet: string[]) => selectionSetObjectToString(selectionSetToObject(selectionSet));

function stringify(obj: unknown): string {
  if (obj instanceof GraphQLEnum) return obj.value;

  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    const props = Object.entries(obj)
      .map(([key, value]): string => `${key}: ${stringify(value)}`)
      .join(',');

    return `{ ${props} }`;
  }

  if (Array.isArray(obj)) return `[${obj.map((item) => stringify(item)).join(',')}]`;

  return JSON.stringify(obj);
}

const buildOperation = (operation: 'query' | 'mutation', name: string, selectionSet: string[], args: Obj) => {
  const argsString = Object.entries(args)
    .filter(([, value]) => !!value)
    .map(([key, value]) => `${key}: ${stringify(value)}`)
    .join(', ');

  return `${operation} { ${name}${argsString ? `(${argsString})` : ''} { ${strigifySelectionSet(selectionSet)} } }`;
};

const forbiddenFields = [
  'id',
  'createdAt',
  'updatedAt',
  'tenantId',
  'tenant',
  'createdById',
  'individual',
  'deletedAt',
  'hiddenAt',
];

export type ExpectNestedRelation = {
  path: string;
  defaultProps?: Record<string, unknown>;
  overwrite?: Record<string, unknown>;
  checkTransform?: (value: Record<string, unknown>) => Record<string, unknown>;
};

@Injectable()
export class HasuraService extends RequestContext {
  axiosInstance: AxiosInstance;

  logger = new Logger(HasuraService.name);

  constructor(
    private readonly em: EntityManager,
    private readonly configService: ConfigService,
    private readonly teamMemberRepository: TeamMemberRepository
  ) {
    super();

    const baseURL = `${loadConfig<string>(this.configService, 'network.hasuraUrl')}/v1/graphql`;
    this.axiosInstance = axios.create({ baseURL, method: 'POST' });

    const adminToken = loadConfig<string>(this.configService, 'hasuraAdminSecret');
    this.axiosInstance.defaults.headers.common['X-Hasura-Admin-Secret'] = adminToken;
  }

  async makeOperation(operation: string) {
    // const headers = {
    //   'X-Hasura-Role': requestContext.get('individual')?.scopeRole || 'anonymous',
    // };

    this.logger.log(`Request - ${JSON.stringify(operation)}`);
    const response = await this.axiosInstance.request({ data: { query: operation } });

    if (response.data.errors) throw new BadRequestException(response.data.errors);
    // this.logger.log(`Response - ${JSON.stringify(response.data)}`);
    return response.data.data;
  }

  async insert(queryName: string, selectionSet: string[], objects: Array<Obj>, onConflict?: Obj, insertOne?: boolean) {
    const selection = insertOne ? selectionSet.map((field) => `returning.${field}`) : selectionSet;
    const query = buildOperation('mutation', queryName, selection, { objects, onConflict });
    const data = await this.makeOperation(query);
    return data;
  }

  async insertOne(queryName: string, selectionSet: string[], objects: Obj, onConflict?: Obj) {
    const query = buildOperation('mutation', queryName, selectionSet, { objects, onConflict });
    const data = await this.makeOperation(query);
    return data;
  }

  async update(queryName: string, selectionSet: string[], where: Obj, _set: Obj) {
    const query = buildOperation('mutation', queryName, selectionSet, { where, _set });
    const data = await this.makeOperation(query);
    return data;
  }

  async updateByPk(queryName: string, selectionSet: string[], pkColumns: Obj, _set: Obj) {
    const query = buildOperation('mutation', queryName, selectionSet, { pkColumns, _set });
    const data = await this.makeOperation(query);
    return data;
  }

  async find(
    queryName: string,
    selectionSet: string[],
    where: Obj,
    orderBy?: Array<Obj>,
    distinctOn?: Array<string>,
    limit?: number,
    offset?: number
  ) {
    const args = { where, orderBy, distinctOn, limit, offset };
    const query = buildOperation('query', queryName, selectionSet, args);
    const data = await this.makeOperation(query);
    return data;
  }

  async findByPk(queryName: string, selectionSet: string[], pkColumns: Obj) {
    const query = buildOperation('query', queryName, selectionSet, pkColumns);
    const data = await this.makeOperation(query);
    return data;
  }

  async aggregate(
    queryName: string,
    selectionSet: string[],
    where: Obj,
    orderBy?: Array<Obj>,
    distinctOn?: Array<string>,
    limit?: number,
    offset?: number
  ) {
    const args = { where, orderBy, distinctOn, limit, offset };
    const query = buildOperation('query', queryName, selectionSet, args);
    const data = await this.makeOperation(query);
    return data;
  }

  async checkTeamPermissions(teamId: string, permissions: number) {
    const individual = this.requester();
    if (!individual.user) throw new InternalServerErrorException('No user found in individual.');

    const teamMember = await this.teamMemberRepository.findOne(
      { team: { id: teamId }, user: individual.user },
      { populate: ['roles'] }
    );

    if (!teamMember)
      throw new ForbiddenException(`You are not a member of the required team (${teamId}) to perform this query.`);

    if (!teamMember.roles.getItems().some((role) => (permissions & role.permissions) === permissions))
      throw new ForbiddenException(
        `You do not have the required permissions (${permissions}) in the required team (${teamId}) to perform this query.`
      );
  }

  checkForbiddenFields(props: Record<string, unknown>) {
    for (const key of forbiddenFields)
      if (key in props && props[key]) throw new BadRequestException(`Forbidden field in mutation: ${key}`);
  }

  applyData<T>(props: T, defaultProps: Record<string, unknown> = {}, overwrite: Record<string, unknown> = {}) {
    return { ...defaultProps, ...props, ...overwrite, tenantId: this.tenant().id, createdById: this.requester().id };
  }

  expectNestedRelationship(props: unknown, relationships: ExpectNestedRelation[]) {
    for (const relationship of relationships) {
      let deepProps = props;

      const pathSegments = relationship.path.split('.');
      const lastPathKey = pathSegments.pop();

      let propsString = 'props';
      deepProps = props;
      if (!lastPathKey) throw new InternalServerErrorException('Invalid arguments: no relationship path provided.');

      for (const dataKey of pathSegments) {
        if (!isNonNullObject(deepProps)) throw new BadRequestException(`Expected ${propsString} to be an object.`);

        propsString += `.${dataKey}`;

        deepProps[dataKey] = typeof deepProps[dataKey] === 'object' ? deepProps[dataKey] : {};
        if (isNonNullObject(deepProps[dataKey])) deepProps = deepProps[dataKey];
      }

      if (!isNonNullObject(deepProps)) throw new BadRequestException(`Expected ${propsString} to be an object.`);
      const dataValue = deepProps[lastPathKey];
      if (!isNonNullObject(dataValue) || !('data' in dataValue) || !isNonNullObject(dataValue.data))
        throw new BadRequestException(`Expected ${propsString}.${lastPathKey} to be an object containing 'data'.`);

      const data = relationship.checkTransform
        ? relationship.checkTransform(this.applyData(dataValue.data, relationship.defaultProps, relationship.overwrite))
        : this.applyData(dataValue.data, relationship.defaultProps, relationship.overwrite);

      deepProps[lastPathKey] = { data };
    }

    return true;
  }

  expectIdRelationships(props: unknown, relationships: Array<string>) {
    for (const relationship of relationships) {
      let deepProps = props;

      const pathSegments = relationship.split('.');
      const lastPathKey = pathSegments.pop();

      let propsString = 'props';
      deepProps = props;
      if (!lastPathKey) throw new InternalServerErrorException('Invalid arguments: no relationship path provided.');

      for (const idKey of pathSegments) {
        if (!isNonNullObject(deepProps) || deepProps[idKey] === undefined)
          throw new BadRequestException(`Expected ${propsString} to be an object.`);

        deepProps = deepProps[idKey];
        propsString += `.${idKey}`;
      }

      if (!isNonNullObject(deepProps)) throw new BadRequestException(`Expected ${propsString} to be an object.`);
      const idProps = deepProps[lastPathKey];
      if (!idProps || typeof idProps !== 'string')
        throw new BadRequestException(`Expected ${propsString}.${lastPathKey} to be a Snowflake.`);
    }

    return true;
  }
}
