import { Selector } from '../../zeus';
import { fileUploadBaseInfo } from '../fileUpload/fileUploadBase';

import { teamMemberWithUser } from '../team/teamMember/teamMemberWithUser';
import { tagBaseInfo } from '../actor/tag/tagBase';
import { entityBase } from '../entityBase';

import { eventManageBaseInfo } from '../event/eventManage/eventManageBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const projectBaseInfo = Selector('Project')({
  ...entityBase,
  color: true,
  name: true,
  slug: true,
  description: true,
  eventManages: [{}, eventManageBaseInfo],
  banner: fileUploadBaseInfo,
  projectSupervisors: [{}, { teamMember: teamMemberWithUser }],
  projectTags: [{}, { tag: tagBaseInfo }],
  isPrivate: true,
});
export type ProjectBaseInfo = InputType<GraphQLTypes['Project'], typeof projectBaseInfo>;
