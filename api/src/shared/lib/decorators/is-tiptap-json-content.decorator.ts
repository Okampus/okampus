import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';
import { z } from 'zod';

export interface JSONContent {
  [key: string]: unknown;
  type?: string;
  attrs?: Record<string, unknown>;
  content?: JSONContent[];
  marks?: Array<{
    [key: string]: unknown;
    type: string;
    attrs?: Record<string, unknown>;
  }>;
  text?: string;
}

const TiptapValidator: z.ZodSchema<JSONContent> = z.lazy(() =>
  z.record(z.any()).and(
    z.object({
      type: z.string().optional(),
      attrs: z.record(z.any()).optional(),
      content: z.array(TiptapValidator).optional(),
      marks: z.array(
        z.record(z.any()).and(
          z.object({
            type: z.string(),
            attrs: z.record(z.any()).optional(),
          }),
        ),
      ).optional(),
      text: z.string().optional(),
    }),
  ));

export function IsTiptapJSONContent(options?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'tiptapJSONContent',
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          if (typeof value !== 'string')
            return false;

          try {
            TiptapValidator.parse(JSON.parse(value));
            return true;
          } catch (e) {
            console.log(e);
            return false;
          }
        },
        defaultMessage: () => '$property is not a valid tiptap JSON content',
      },
    });
  };
}
