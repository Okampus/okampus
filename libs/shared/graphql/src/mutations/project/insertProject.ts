import { projectBaseInfo } from '../../selectors/project/projectBase';
import { teamBaseInfo } from '../../selectors/team/teamBase';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';

// @ts-expect-error - Zeus depth limit
export const insertProject = typedGql('mutation')({
  insertProjectOne: [
    { object: $('insert', 'ProjectInsertInput!') },
    {
      ...projectBaseInfo,
      org: {
        ...teamBaseInfo,
        projects: [{}, projectBaseInfo],
      },
    },
  ],
});
