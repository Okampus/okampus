import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { z } from 'zod';
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';

const diffSchema = z.object({
  count: z.number(),
  value: z.string(),
  added: z.optional(z.boolean()),
  removed: z.optional(z.boolean()),
});
const fullDiffSchema = diffSchema.array();

export function validateDiff(form: unknown): form is object {
  return fullDiffSchema.safeParse(form).success;
}

@ValidatorConstraint()
export class DiffConstraint implements ValidatorConstraintInterface {
  public validate(object: unknown, _args: ValidationArguments): boolean {
    return validateDiff(object);
  }

  public defaultMessage(_validationOptions: ValidationArguments): string {
    return '$property must be a valid FormKit schema';
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsDiff(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isDiff',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: DiffConstraint,
    });
  };
}
