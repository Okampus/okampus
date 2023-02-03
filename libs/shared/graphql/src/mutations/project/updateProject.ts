import { gql } from '../../schema/__generated__/gql';

export const updateProjectMutation = gql(`
  mutation updateProject($updateProject: UpdateProjectDto!) {
    updateProject(updateProject: $updateProject) {
      ...ProjectInfo
    }
  }
`);
