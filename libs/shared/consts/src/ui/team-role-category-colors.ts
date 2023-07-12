import { COLORS } from '../global/colors';
import { RoleCategory } from '@okampus/shared/enums';

export const TEAM_ROLE_CATEGORY_COLORS = {
  [RoleCategory.Directors]: COLORS.Red,
  [RoleCategory.Managers]: COLORS.Lime,
  [RoleCategory.Members]: COLORS.LightBlue,
};
