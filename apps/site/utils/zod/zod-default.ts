import { z } from 'zod';
import type { AnyZodObject, TypeOf } from 'zod';
import type { PartialDeep } from '@okampus/shared/types';

export function getZodDefaults<T extends AnyZodObject>(
  schema: T,
  ...defaultValues: (PartialDeep<TypeOf<T>> | undefined)[]
): PartialDeep<TypeOf<T>> {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      if (value instanceof z.ZodObject) {
        const subValues = defaultValues.map((value) => value?.[key] ?? undefined);
        return [key, getZodDefaults(value, ...subValues)];
      }

      const defaultValue = defaultValues.find((value) => value?.[key])?.[key];
      return [key, defaultValue ?? (value instanceof z.ZodDefault ? value._def.defaultValue() : undefined)];
    }),
  ) as Partial<TypeOf<T>>;
}
