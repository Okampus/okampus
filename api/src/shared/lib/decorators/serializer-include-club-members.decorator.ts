import { applyDecorators, SerializeOptions } from '@nestjs/common';
import { CLUB_MEMBERS_INCLUDED } from '../constants';

export function SerializerIncludeClubMembers(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUB_MEMBERS_INCLUDED] }));
}
