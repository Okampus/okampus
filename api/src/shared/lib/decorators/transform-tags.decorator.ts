import type { Collection } from '@mikro-orm/core';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export function TransformTags(): PropertyDecorator {
  return applyDecorators(Transform(({ obj }: { obj: { tags: Collection<string> } }) => {
    if (obj.tags.isInitialized())
      return Object.values(obj.tags).filter(tag => typeof tag === 'object');
    return null;
  }));
}
