import { applyDecorators, SerializeOptions } from '@nestjs/common';
import {
  CLUB_MEMBERS_INCLUDED,
  CLUB_SOCIALS_CLUB_INCLUDED,
  CLUB_SOCIALS_INCLUDED,
  CLUBMEMBER_CLUB_INCLUDED,
  CONTENT_AUTHOR_EXCLUDED,
  PERSONAL_INFO_INCLUDED,
} from '../constants';

export function SerializerIncludePersonalInfo(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [PERSONAL_INFO_INCLUDED] }));
}

export function SerializerExcludeContentAuthor(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CONTENT_AUTHOR_EXCLUDED] }));
}

export function SerializerIncludeClubMembers(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUB_MEMBERS_INCLUDED] }));
}

export function SerializerClubMemberIncludeClub(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUBMEMBER_CLUB_INCLUDED] }));
}

export function SerializerIncludeClubSocials(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUB_SOCIALS_INCLUDED] }));
}

export function SerializerClubSocialsIncludeClub(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUB_SOCIALS_CLUB_INCLUDED] }));
}
