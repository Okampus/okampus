import { applyDecorators, SerializeOptions } from '@nestjs/common';
import {
  CLUB_CONTACTS_CLUB_INCLUDED,
  CLUB_CONTACTS_INCLUDED,
  CLUB_MEMBERS_INCLUDED,
  CLUBMEMBER_CLUB_INCLUDED,
  CONTENT_AUTHOR_EXCLUDED,
  TEAM_MEMBERS_INCLUDED,
  TEAMMEMBER_TEAM_INCLUDED,
} from '../constants';

export function SerializerExcludeContentAuthor(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CONTENT_AUTHOR_EXCLUDED] }));
}

export function SerializerIncludeTeamMembers(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [TEAM_MEMBERS_INCLUDED] }));
}

export function SerializerTeamMemberIncludeTeam(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [TEAMMEMBER_TEAM_INCLUDED] }));
}

export function SerializerIncludeClubMembers(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUB_MEMBERS_INCLUDED] }));
}

export function SerializerClubMemberIncludeClub(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUBMEMBER_CLUB_INCLUDED] }));
}

export function SerializerIncludeClubContacts(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUB_CONTACTS_INCLUDED] }));
}

export function SerializerClubContactsIncludeClub(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [CLUB_CONTACTS_CLUB_INCLUDED] }));
}
