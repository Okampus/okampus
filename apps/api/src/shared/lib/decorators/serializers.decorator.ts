import { applyDecorators, SerializeOptions } from '@nestjs/common';
import {
  CONTENT_AUTHOR_EXCLUDED,
  TEAM_CONTACTS_INCLUDED,
  TEAM_CONTACTS_TEAM_INCLUDED,
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

export function SerializerIncludeTeamContacts(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [TEAM_CONTACTS_INCLUDED] }));
}

export function SerializerTeamContactsIncludeTeam(): ReturnType<typeof applyDecorators> {
  return applyDecorators(SerializeOptions({ groups: [TEAM_CONTACTS_TEAM_INCLUDED] }));
}
