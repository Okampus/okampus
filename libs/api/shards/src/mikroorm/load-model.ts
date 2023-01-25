import { AnyEntity, wrap } from '@mikro-orm/core';

/* Get entity data if entity is not initialised in MikroORM, otherwise return null */
export function loadEntityData<T extends AnyEntity, U>(entity: T, modelFactory: (entity: T) => U): undefined | U {
  if (wrap(entity).isInitialized()) return modelFactory(entity);
  return undefined;
}
