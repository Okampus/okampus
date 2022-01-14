import { applyDecorators, SerializeOptions } from '@nestjs/common';
import { CLUBMEMBER_CLUB_INCLUDED } from '../constants';

export function SerializerIncludeClubMemberClub(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUBMEMBER_CLUB_INCLUDED] }));
}
