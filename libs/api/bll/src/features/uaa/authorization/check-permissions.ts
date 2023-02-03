import { ForbiddenError } from '@casl/ability';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { Individual } from '@okampus/api/dal';
import { Action } from '@okampus/shared/enums';
import { getErrorMessage } from '@okampus/shared/utils';
import { createAbilitiesForIndividual, Subjects } from './casl/get-abilities';

export function assertPermissions(requester: Individual, action: Action, target: Subjects, fields: string[] = []) {
  const ability = createAbilitiesForIndividual(requester);
  try {
    if (fields.length === 0) {
      ForbiddenError.from(ability).throwUnlessCan(action, target);
    }

    const error = ForbiddenError.from(ability);
    for (const field of fields) error.throwUnlessCan(action, target, field);
  } catch (error) {
    if (error instanceof ForbiddenError) throw new ForbiddenException(error.message);
    throw new InternalServerErrorException(getErrorMessage(error));
  }
}

export function checkPermissions(requester: Individual, action: Action, target: Subjects, fields: string[] = []) {
  const ability = createAbilitiesForIndividual(requester);
  if (fields.length === 0) return ability.can(action, target);
  for (const field of fields) if (!ability.can(action, target, field)) return false;
  return true;
}
