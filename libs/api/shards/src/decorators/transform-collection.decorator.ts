import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import type { Collection } from '@mikro-orm/core';
import type { TransformFnParams } from 'class-transformer';

interface Params extends TransformFnParams {
  obj: Record<string, Collection<object>>;
}

export function TransformCollection(): PropertyDecorator {
  return applyDecorators(
    Transform(({ obj, key }: Params) => {
      if (obj[key].isInitialized())
        return Object.values(obj[key]).filter((item) => typeof item === 'object');
      return null;
    })
  );
}
