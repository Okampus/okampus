import { applyDecorators, SerializeOptions } from '@nestjs/common';
import {
  CLUB_MEMBERS_INCLUDED,
  CLUB_SOCIALS_CLUB_INCLUDED,
  CLUB_SOCIALS_INCLUDED,
  CLUBMEMBER_CLUB_INCLUDED,
  EMAIL_INCLUDED,
  PERSONAL_INFO_INCLUDED,
} from '../constants';

export function SerializerIncludeEmail(): ClassDecorator {
  return applyDecorators(SerializeOptions({ groups: [EMAIL_INCLUDED] }));
}

export function SerializerIncludePersonalInfo(): ClassDecorator {
  return applyDecorators(SerializeOptions({ groups: [PERSONAL_INFO_INCLUDED] }));
}

export function SerializerIncludeClubMembers(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUB_MEMBERS_INCLUDED] }));
}

export function SerializerClubMemberIncludeClub(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUBMEMBER_CLUB_INCLUDED] }));
}

export function SerializerIncludeClubSocials(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUB_SOCIALS_INCLUDED] }));
}

export function SerializerClubSocialsIncludeClub(): MethodDecorator {
  return applyDecorators(SerializeOptions({ groups: [CLUB_SOCIALS_CLUB_INCLUDED] }));
}
