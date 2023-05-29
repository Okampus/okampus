import { RequestContext } from '../../shards/abstract/request-context';
import { loadConfig } from '../../shards/utils/load-config';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from '@nestjs/config';
import { GraphQLEnum, isNonNullObject } from '@okampus/shared/utils';

import axios from 'axios';
import type { AxiosInstance } from 'axios';

type Obj = Record<string, unknown>;
interface Fields {
  [key: string]: true | Fields;
}
type Relationship = { idPath: string; relPath?: string };

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

@Injectable()
export class HasuraService extends RequestContext {
  axiosInstance: AxiosInstance;

  logger = new Logger(HasuraService.name);

  constructor(private readonly configService: ConfigService) {
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

  applyData<T>(props: T, defaultProps: Record<string, unknown> = {}, overwrite: Record<string, unknown> = {}) {
    return {
      ...defaultProps,
      ...props,
      ...overwrite,
      tenantId: this.tenant().id,
      createdById: this.requester().id,
    };
  }

  expectData<T extends Record<string, unknown>>(
    props: T,
    dataPath: string,
    defaultProps: Record<string, unknown> = {},
    overwrite: Record<string, unknown> = {}
  ) {
    let data: Record<string, unknown> = props;

    const dataKeys = dataPath.split('.');
    const lastDataKey = dataKeys.pop();

    if (!lastDataKey) throw new BadRequestException('Invalid arguments: no dataPath provided.');

    if (!isNonNullObject(data)) throw new BadRequestException(`Invalid props: props must be an object.`);
    for (const dataKey of dataKeys) {
      data[dataKey] = typeof data[dataKey] === 'object' ? data[dataKey] : {};
      const dataValue = data[dataKey];
      if (isNonNullObject(dataValue)) data = dataValue;
    }

    const dataValue = data[lastDataKey];
    if (!isNonNullObject(dataValue))
      throw new BadRequestException(`Invalid props: props.${dataPath} must be an object.`);

    data[lastDataKey] = { data: this.applyData(dataValue.data ?? {}, defaultProps, overwrite) };
    return true;
  }

  expectRelationship<T>(props: T, relationships: Array<Relationship>) {
    for (const relationship of relationships) {
      let id;
      let deepProps: unknown = props;

      const relPath = relationship.relPath || '';
      const relKeys = relPath.split('.');
      const lastKey = relKeys.pop();

      if (lastKey) {
        // else no relPath was provided
        for (const relKey of relKeys) {
          if (!isNonNullObject(deepProps) || deepProps[relKey] === undefined) break;
          deepProps = deepProps[relKey];
        }

        if (isNonNullObject(deepProps)) {
          const relProps = deepProps[lastKey];
          if (
            relProps &&
            isNonNullObject(relProps) &&
            relProps.data &&
            isNonNullObject(relProps.data) &&
            relProps.data.id &&
            typeof relProps.data.id === 'string'
          ) {
            id = relProps.data.id;
          }
          delete deepProps[lastKey];
        }
      }

      const idKeys = relationship.idPath.split('.');
      const lastIdKey = idKeys.pop();

      let propsString = 'props';
      let errorString = 'Invalid arguments: no idPath provided.';
      deepProps = props;
      if (lastIdKey) {
        // else no idPath was provided
        for (const idKey of idKeys) {
          if (!isNonNullObject(deepProps) || deepProps[idKey] === undefined) {
            errorString = `Invalid props: ${propsString} must be an object.`;
            break;
          }
          deepProps = deepProps[idKey];
          propsString += `.${idKey}`;
        }

        if (isNonNullObject(deepProps)) {
          const idProps = deepProps[lastIdKey];
          if (idProps && typeof idProps === 'string') {
            id = idProps;
            delete deepProps[lastIdKey];
          } else {
            errorString = `Invalid props: ${propsString}.${lastIdKey} must be a string.`;
          }
        } else {
          errorString = `Invalid props: ${propsString} must be an object.`;
        }
      }

      if (!id) throw new BadRequestException(errorString);
    }

    return true;
  }
}
