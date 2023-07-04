import { projectBaseInfo } from '../../selectors/project/projectBase';
import { teamBaseInfo } from '../../selectors/team/teamBase';
import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import type { ValueTypes } from '../../zeus';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const insertProject = typedGql('mutation')({
  insertProjectOne: [
    { object: $('object', 'ProjectInsertInput!') as ValueTypes['ProjectInsertInput'] },
    { ...projectBaseInfo, team: { ...teamBaseInfo, projects: [{}, projectBaseInfo] } },
  ],
});
