import { projectBaseInfo } from '../../selectors/project/projectBase';
import { teamBaseInfo } from '../../selectors/team/teamBase';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertProject = typedGql('mutation')({
  insertProjectOne: [
    { object: $('object', 'ProjectInsertInput!') as ValueTypes['ProjectInsertInput'] },
    {
      ...projectBaseInfo,
      org: {
        ...teamBaseInfo,
        projects: [{}, projectBaseInfo],
      },
    },
  ],
});
