import { registerDecorator, ValidatorConstraint } from 'class-validator';
import { validateDiff } from '@okampus/shared/utils';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';

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
