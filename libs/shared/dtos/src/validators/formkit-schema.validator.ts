import { validateFormkit } from '@okampus/shared/utils';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint()
export class FormKitSchemaConstraint implements ValidatorConstraintInterface {
  public validate(form: unknown, _args: ValidationArguments): boolean {
    return validateFormkit(form);
  }

  public defaultMessage(_validationOptions: ValidationArguments): string {
    return '$property must be a valid FormKit schema';
  }
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function IsFormKitSchema(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: 'isFormKitSchema',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: FormKitSchemaConstraint,
    });
  };
}
