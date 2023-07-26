import { registerDecorator, ValidatorConstraint } from 'class-validator';
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint()
export class Iso8601DurationConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line prefer-named-capture-group
  private static readonly regex = /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d+[HMS])(\d+H)?(\d+M)?(\d+S)?)?$/;

  public validate(value: unknown, _args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;

    return Iso8601DurationConstraint.regex.test(value);
  }

  public defaultMessage(_validationOptions: ValidationArguments): string {
    return '$property must be a valid ISO 8601 duration string';
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsIso8601Duration(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'IsIso8601Duration',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: Iso8601DurationConstraint,
    });
  };
}
