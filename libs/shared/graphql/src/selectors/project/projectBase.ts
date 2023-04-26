import { Selector } from '../../zeus';
import { uploadBaseInfo } from '../upload/uploadBase';

import { teamMemberWithUserInfo } from '../team/teamMember/teamMemberWithUser';
import { tagBaseInfo } from '../actor/tag/tagBase';
import { eventDetailsInfo } from '../event/eventDetails';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const projectBaseInfo = Selector('Project')({
  ...entityBase,
  name: true,
  slug: true,
  description: true,
  eventsAggregate: [
    {},
    {
      nodes: eventDetailsInfo,
      aggregate: {
        min: {
          start: true,
        },
        max: {
          end: true,
        },
      },
    },
  ],
  upload: uploadBaseInfo,
  projectSupervisors: [{}, { teamMember: teamMemberWithUserInfo }],
  projectTags: [{}, { tag: tagBaseInfo }],
  isPrivate: true,
});
export type ProjectBaseInfo = InputType<GraphQLTypes['Project'], typeof projectBaseInfo>;