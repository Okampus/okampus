import { gql } from '../../schema/__generated__/gql';

export const updateTeamMutation = gql(`
  mutation updateTeam($updateTeam: UpdateTeamDto!, $avatar: Upload, $banner: Upload) {
    updateTeam(updateTeam: $updateTeam, avatar: $avatar, banner: $banner) {
      ...TeamManageInfo
    }
  }
`);
