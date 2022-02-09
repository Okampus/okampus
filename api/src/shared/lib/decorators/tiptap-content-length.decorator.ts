import type { ValidationArguments, ValidationOptions } from 'class-validator';
import { buildMessage, length, ValidateBy } from 'class-validator';
import { extractTextFromStringifiedTiptap } from '../utils/extract-text-from-tiptap';

export function TiptapContentLength(
  min: number,
  max?: number,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy({
      name: 'tiptapContentLength',
      constraints: [min, max],
      validator: {
        validate(value: unknown, args: ValidationArguments & { constraints: [min: number, max: number | undefined] }) {
          if (typeof value !== 'string')
            return false;

          const content = extractTextFromStringifiedTiptap(value);
          return length(content, args.constraints[0], args.constraints[1]);
        },
        defaultMessage: buildMessage((eachPrefix, args) => {
          const isMinLength = args?.constraints[0] !== null && typeof args?.constraints[0] !== 'undefined';
          const isMaxLength = args?.constraints[1] !== null && typeof args?.constraints[1] !== 'undefined';

          if (isMinLength && (!args.value || args.value.length < args.constraints[0]))
            return `${eachPrefix}$property must be longer than or equal to $constraint1 characters`;
          if (isMaxLength && args.value.length > args.constraints[1])
            return `${eachPrefix}$property must be shorter than or equal to $constraint2 characters`;
          return `${eachPrefix}$property must be longer than or equal to $constraint1 and shorter than or equal to $constraint2 characters`;
        }, validationOptions),
      },
    }, validationOptions);
}
