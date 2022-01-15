import type { Collection } from '@mikro-orm/core';
import { applyDecorators } from '@nestjs/common';
import type { TransformFnParams } from 'class-transformer';
import { Transform } from 'class-transformer';

interface Params extends TransformFnParams {
  obj: Record<string, Collection<unknown>>;
}

export function TransformCollection(): PropertyDecorator {
  return applyDecorators(
    Transform(({ obj, key }: Params) => {
      if (obj[key].isInitialized())
        return Object.values(obj[key]).filter(item => typeof item === 'object');
      return null;
    }),
  );
}
