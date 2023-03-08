import { gql } from '../../schema/__generated__/gql';

export const updateUserMutation = gql(`
  mutation updateUser($updateUser: UpdateUserDto!, $avatar: Upload, $banner: Upload) {
    updateUser(updateUser: $updateUser, avatar: $avatar, banner: $banner) {
      ...UserInfo
    }
  }
`);
