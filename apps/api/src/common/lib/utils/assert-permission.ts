import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import type { Action } from '../../modules/authorization';
import type { AppAbility, Subjects } from '../../modules/casl/casl-ability.factory';

export function assertPermissions(
  ability: AppAbility,
  action: Action,
  subject: Subjects,
  fields?: string[],
): void {
  try {
    if (typeof fields === 'undefined' || fields.length === 0) {
      ForbiddenError.from(ability).throwUnlessCan(action, subject);
    } else {
      const error = ForbiddenError.from(ability);
      for (const field of fields)
        error.throwUnlessCan(action, subject, field);
    }
  } catch (error) {
    if (error instanceof ForbiddenError)
      throw new ForbiddenException(error.message);
    throw new InternalServerErrorException(error.message);
  }
}
