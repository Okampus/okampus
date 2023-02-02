import { gql } from '../../schema/__generated__/gql';

export const createProjectMutation = gql(`
  mutation createProject($project: CreateProjectDto!) {
    createProject(project: $project) {
      ...ProjectInfo
    }
  }
`);
