import { gql } from '../schema/__generated__/gql';

export const getTeamManageQuery = gql(`
  query getTeamManage($id: String!) {
    teamById(id: $id) {
      ...TeamMembersInfo
      finances {
        ...FinanceInfo
      }
    }
  }
`);
