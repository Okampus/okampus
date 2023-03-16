import { loadTenantScopedEntity } from './domains/loader';
import { assertPermissions, checkPermissions } from '../../features/uaa/authorization/check-permissions';
import { RequestContext } from '../../shards/abstract/request-context';
import { PageInfo } from '../../shards/types/page-info.type';
import { decodeCursor, encodeCursor, getCursorColumns, makeCursor } from '../../shards/utils/cursor-serializer';

import { BadRequestException } from '@nestjs/common';
import { processPopulatePaginated } from '@okampus/api/shards';
import { DEFAULT_PAGINATION_LIMIT } from '@okampus/shared/consts';
import { Action, QueryOrder } from '@okampus/shared/enums';
import { isNotNull } from '@okampus/shared/utils';

import type { UploadService } from '../../features/upload/upload.service';
import type { BaseModel } from './abstract/base.model';
import type { Subjects } from '../../features/uaa/authorization/casl/get-abilities';
import type { PaginatedNodes } from '../../shards/types/paginated.type';
import type { PaginationOptions } from '../../shards/types/pagination-options.type';
import type {
  AssignOptions,
  FilterQuery,
  FindOptions,
  FindOneOptions,
  FindOneOrFailOptions,
  Populate,
  EntityData,
} from '@mikro-orm/core';
import type { EventPublisher } from '@nestjs/cqrs';
import type { BaseEntity, BaseRepository, TenantScopedEntity } from '@okampus/api/dal';
import type { IBase } from '@okampus/shared/dtos';
import type { Constructor, CursorColumns, CursorColumnTypes } from '@okampus/shared/types';

type PaginationFindOptions<T extends BaseEntity, P extends string> = Omit<
  FindOptions<T, P>,
  'limit' | 'offset' | 'orderBy'
>;

const forbiddenKeys = ['id', 'createdAt', 'updatedAt', 'deletedAt'];

// TODO: fix types
export abstract class BaseFactory<
  Model extends BaseModel,
  Entity extends TenantScopedEntity,
  Interface extends IBase,
  Options
> extends RequestContext {
  constructor(
    private readonly eventPublisher: EventPublisher,
    protected readonly uploadService: UploadService,
    private readonly repository: BaseRepository<Entity>,
    private readonly ModelClass: Constructor<Model>,
    private readonly EntityClass: Constructor<Entity>
  ) {
    super();
  }

  public abstract modelToEntity(model: Required<Model>): Entity;

  public entityToModel(entity: Entity): Model | undefined {
    const raw = loadTenantScopedEntity(entity, {});
    if (!raw) return undefined;
    return this.createModel(raw as unknown as Interface);
  }

  public entityToModelOrFail(entity: Entity): Model {
    const model = this.entityToModel(entity);
    if (!model) throw new BadRequestException('Entity could not be loaded');
    return model;
  }

  public async findOne(where: FilterQuery<Entity>, findOptions?: FindOneOptions<Entity>): Promise<Model | null> {
    const entity = await this.repository.findOne(where, findOptions);
    return entity ? this.entityToModel(entity) ?? null : null;
  }

  public async findOneOrFail(where: FilterQuery<Entity>, findOptions?: FindOneOrFailOptions<Entity>): Promise<Model> {
    const entity = await this.repository.findOneOrFail(where, findOptions);
    const requester = this.requester();
    if (requester) assertPermissions(requester, Action.Read, entity as unknown as Subjects);
    return this.entityToModelOrFail(entity);
  }

  // TODO: make more readable
  public async findWithPagination<P extends string = never>(
    paginationOptions?: PaginationOptions,
    where: FilterQuery<Entity> = {},
    baseOptions?: PaginationFindOptions<Entity, P>
  ): Promise<PaginatedNodes<Model>> {
    let columns: CursorColumns | null = null;

    const { populate: populatePaginated, ...options } = baseOptions ?? {};
    if (typeof populatePaginated === 'boolean') throw new BadRequestException('Populate must be an array of strings');

    const { getCursor, getPageInfo, populate } = processPopulatePaginated(populatePaginated ?? []);

    const limit = paginationOptions?.limit ?? DEFAULT_PAGINATION_LIMIT;
    const offset: number = paginationOptions?.offset ?? 0;

    if (paginationOptions?.after) {
      columns = decodeCursor(paginationOptions.after);
    } else if (paginationOptions?.before) {
      // Invert the query order of the columns
      columns = Object.fromEntries(
        Object.entries(decodeCursor(paginationOptions.before)).map(([colName, [value, order]]) => [
          colName,
          [value, order === QueryOrder.ASC ? QueryOrder.DESC : QueryOrder.ASC],
        ])
      );
    }

    const orderBy =
      paginationOptions?.orderBy ??
      (columns
        ? Object.fromEntries(Object.entries(columns).map(([col, [_, order]]) => [col, order]))
        : { id: QueryOrder.ASC });

    const colCondition = (colName: string, value: CursorColumnTypes, selector: '$gt' | '$lt'): FilterQuery<Entity> =>
      (selector === '$lt'
        ? value === null
          ? { [colName]: { $ne: null } }
          : { [colName]: { [selector]: value } }
        : {
            $or: [{ [colName]: { $gt: value } }, { [colName]: { $eq: null } }],
          }) as FilterQuery<Entity>;

    const getNextColsConditions = (
      colArray: Array<[colName: string, colInfo: [value: CursorColumnTypes, order: QueryOrder]]>
    ): FilterQuery<Entity> => {
      const [lastCol, ...eqCols] = colArray.reverse();
      const lastColCondition = colCondition(
        lastCol[0],
        lastCol[1][0],
        lastCol[1][1] === QueryOrder.ASC ? '$gt' : '$lt'
      );

      if (eqCols.length === 0) return lastColCondition;

      const eqColsConditions = eqCols.map(([colName, [value, _]]) => ({
        [colName]: { $eq: value },
      }));
      return {
        $and: [...eqColsConditions, lastColCondition],
      } as FilterQuery<Entity>;
    };

    const getWhereFind = (findColumns: CursorColumns): FilterQuery<Entity> => {
      if (!findColumns) return {} as FilterQuery<Entity>;

      return {
        $or: Object.entries(findColumns)
          .map(([_, [value, order]], idx, arr) =>
            value === null && order === QueryOrder.ASC
              ? null // > NULL is always false
              : getNextColsConditions(arr.slice(0, idx + 1))
          )
          .filter((x) => x !== null),
      } as FilterQuery<Entity>;
    };

    const items = await this.repository.find(
      columns ? ({ $or: [where, getWhereFind(columns)] } as FilterQuery<Entity>) : where,
      // eslint-disable-next-line unicorn/no-array-method-this-argument
      { ...options, populate, orderBy, limit, offset }
    );

    if (items.length === 0) return { edges: [], pageInfo: null };

    const first = items[0];
    const last = items[items.length - 1];

    const requester = this.requester();

    const edges = items
      .map((value) => {
        const node = this.entityToModel(value);
        return node ? { entity: value, node } : null;
      })
      .filter(isNotNull)
      .filter((value) => requester || checkPermissions(requester, Action.Read, value.entity))
      .map((value) => ({ node: value.node, cursor: getCursor ? makeCursor(value.entity, orderBy) : null }));

    let pageInfo: PageInfo | null = null;
    if (getPageInfo) {
      const nEdges = edges.length;
      if (nEdges > 0) {
        const startCusorColumns = getCursorColumns(first, orderBy);
        const endCursorColumns = getCursorColumns(last, orderBy);

        const [countBefore, countAfter] = await Promise.all([
          startCusorColumns
            ? this.repository.count({ $or: [where, getWhereFind(startCusorColumns)] } as FilterQuery<Entity>)
            : 0,
          endCursorColumns
            ? this.repository.count({ $or: [where, getWhereFind(endCursorColumns)] } as FilterQuery<Entity>)
            : 0,
        ]);

        const startCursor = edges[0].cursor ?? encodeCursor(startCusorColumns);
        const endCursor = edges[nEdges - 1].cursor ?? encodeCursor(endCursorColumns);

        pageInfo = new PageInfo(startCursor, endCursor, nEdges, countBefore, countAfter, limit);
      } else {
        pageInfo = new PageInfo(null, null, 0, 0, 0, limit);
      }
    }

    return { edges, pageInfo };
  }

  public async persistAndFlush(data: Entity | Entity[]): Promise<void> {
    await this.repository.persistAndFlush(data);
  }

  public async create(data: Options, transform: (entity: Entity) => Promise<Entity> = async (_) => _): Promise<Model> {
    const entity = new this.EntityClass(data);

    const requester = this.requester();
    if (requester) assertPermissions(requester, Action.Create, entity as unknown as Subjects);

    const saveEntity = await transform(entity);
    await this.repository.persistAndFlush(saveEntity);
    return this.entityToModelOrFail(saveEntity);
    // return this.entityToModel(entity);
  }

  // TODO: error handling
  // public async saveEntities(data: Entity | Entity[]): Promise<Model[]> {
  //   const entities = Array.isArray(data) ? data : [data];
  //   await this.repository.persistAndFlush(entities);
  //   return entities.map((entity) => this.entityToModel(entity));
  // }

  // public async saveModels(data: Model | Model[]): Promise<Model[]> {
  //   const models = Array.isArray(data) ? data : [data];
  //   const entities = models.map((model) => this.modelToEntity(model));
  //   await this.repository.persistAndFlush(entities);
  //   return entities.map((entity) => this.entityToModel(entity));
  // }

  // public async saveOneEntity(data: Entity): Promise<Model> {
  //   await this.repository.persistAndFlush(data);
  //   return this.entityToModel(data);
  // }

  // public async saveOneModel(data: Model): Promise<Model> {
  //   const entity = this.modelToEntity(data);
  //   await this.repository.persistAndFlush(entity);
  //   return this.entityToModel(entity);
  // }

  public createModel(raw: Interface): Model {
    return this.eventPublisher.mergeObjectContext(new this.ModelClass(raw));
  }

  // public createEntity(options: Options): Entity {
  //   return new this.EntityClass(options);
  // }

  public async update(
    where: FilterQuery<Entity>,
    populate: Populate<Entity>,
    data: EntityData<Entity>,
    force = false,
    transform: (entity: Entity) => Promise<Entity> = async (data) => data,
    transformModel: (entity: Model) => Promise<Model> = async (data) => data,
    options: AssignOptions = {}
  ): Promise<Model> {
    const entity = await this.repository.findOneOrFail(where, { populate });

    const requester = this.requester();
    if (requester && !force) assertPermissions(requester, Action.Update, entity, Object.keys(data));

    if (forbiddenKeys.some((key) => key in data))
      throw new BadRequestException(`Cannot update forbidden key on ${this.EntityClass.name}`);

    if (!('mergeObjects' in options)) options.mergeObjects = true;
    if (!('updateByPrimaryKey' in options)) options.updateByPrimaryKey = false;

    this.repository.assign(entity, data, options);
    const transformedEntity = await transform(entity);
    await this.repository.flush();
    return transformModel(this.entityToModelOrFail(transformedEntity));
  }

  // TODO: refactor as separate logic
  // public async updateActor<T extends ActorEntityType>(
  //   tenant: TenantCore,
  //   where: FilterQuery<T>,
  //   populate: Populate<T>,
  //   data: FlatActorData<T>,
  //   transformData?: (data: DeepPartial<T>, entity: T) => Promise<DeepPartial<T>>,
  //   images?: ActorImageUploadProps,
  //   force = false,
  //   options?: AssignOptions
  // ): Promise<Model> {
  //   const { name, bio, primaryEmail, slug, ...entityProps } = data;
  //   const actor = keepDefined({ name, bio, primaryEmail, slug });
  //   const assignData = { ...(isEmpty(actor) ? {} : { actor }), ...entityProps };

  //   const transform = async (data: DeepPartial<T>, entity: T): Promise<DeepPartial<T>> => {
  //     if (images) await addImagesToActor(entity.actor, entity.actor.actorKind(), images, tenant, this.uploadService);
  //     return transformData ? transformData(data, entity) : data;
  //   };

  //   const model = (await this.update(
  //     { $and: [where, { tenant }] } as FilterQuery<Entity>,
  //     populate,
  //     assignData,
  //     transform as unknown as (data: DeepPartial<Entity>, entity: Entity) => Promise<DeepPartial<Entity>>,
  //     force,
  //     { ...options, updateByPrimaryKey: false }
  //   )) as Model & { actor: ActorModel };

  //   if (images && model.actor.actorImages) {
  //     const notCurrentImage = (image: IActorImage) => !image.lastActiveDate;
  //     model.actor.actorImages = model.actor.actorImages.filter(notCurrentImage);
  //   }

  //   return model;
  // }

  public async delete(where: FilterQuery<Entity>): Promise<boolean> {
    const entity = await this.repository.findOneOrFail(where);

    const requester = this.requester();
    if (requester) assertPermissions(requester, Action.Delete, entity as unknown as Subjects);

    entity.deletedAt = new Date();
    await this.repository.flush();
    return true;
  }

  public async hide(where: FilterQuery<Entity>): Promise<boolean> {
    const entity = await this.repository.findOneOrFail(where);
    if (entity.deletedAt || entity.lastHiddenAt) {
      throw new BadRequestException(`${this.EntityClass.name} has been deleted or hidden`);
    }

    entity.lastHiddenAt = new Date();
    await this.repository.flush();
    return true;
  }

  public async unhide(where: FilterQuery<Entity>): Promise<boolean> {
    const entity = await this.repository.findOneOrFail(where);
    if (entity.deletedAt) {
      throw new BadRequestException(`${this.EntityClass.name} has been deleted`);
    }

    entity.lastHiddenAt = null;
    await this.repository.flush();
    return true;
  }
}
