export enum SubspaceType {
  Home = 'Home',
  Admin = 'Admin',
  Org = 'Org',
  Manage = 'Manage',
  User = 'User',
  Me = 'Me',
}

export interface SelectedMenu {
  subSpace: SubspaceType;
  menu: number;
  subMenu: number;
}

export const defaultSelectedMenu: SelectedMenu = {
  subSpace: SubspaceType.Home,
  menu: 0,
  subMenu: 0,
};
