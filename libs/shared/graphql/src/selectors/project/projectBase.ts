import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';

import { teamMemberWithUser } from '../team/teamMember/teamMemberWithUser';
import { tagBaseInfo } from '../actor/tag/tagBase';
import { entityBase } from '../entityBase';

import { eventOrganizeBaseInfo } from '../event/eventOrganize/eventOrganizeBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const projectBaseInfo = Selector('Project')({
  ...entityBase,
  color: true,
  name: true,
  slug: true,
  description: true,
  eventOrganizes: [{}, eventOrganizeBaseInfo],
  banner: fileUploadBaseInfo,
  projectSupervisors: [{}, { teamMember: teamMemberWithUser }],
  projectTags: [{}, { tag: tagBaseInfo }],
  isPrivate: true,
});
export type ProjectBaseInfo = InputType<GraphQLTypes['Project'], typeof projectBaseInfo>;
