import { HOME_ROUTE } from '@okampus/shared/consts';
import { SubspaceType, ViewType } from '@okampus/shared/enums';

export interface SelectedMenu {
  subSpace: SubspaceType;
  viewType: ViewType;
  menuId: string;
}

export const defaultSelectedMenu: SelectedMenu = {
  subSpace: SubspaceType.Home,
  viewType: ViewType.Community,
  menuId: HOME_ROUTE,
};
