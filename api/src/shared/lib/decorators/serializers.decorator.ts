import { applyDecorators, SerializeOptions } from '@nestjs/common';
import {
  CLUB_MEMBERS_INCLUDED,
  CLUBMEMBER_CLUB_INCLUDED,
  EMAIL_INCLUDED,
} from '../constants';

export function SerializerIncludeEmail(): ClassDecorator {
  return applyDecorators(SerializeOptions({ groups: [EMAIL_INCLUDED] }));
}

export function SerializerIncludeClubMembers(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUB_MEMBERS_INCLUDED] }));
}

export function SerializerClubMemberIncludeClub(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUBMEMBER_CLUB_INCLUDED] }));
}
