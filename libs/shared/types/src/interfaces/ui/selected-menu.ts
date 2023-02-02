export enum SubspaceTypes {
  Home = 'Home',
  Admin = 'Admin',
  Manage = 'Manage',
  Me = 'Me',
}

export interface SelectedMenu {
  subSpace: SubspaceTypes;
  menu: number;
  subMenu: number;
}

export const defaultSelectedMenu: SelectedMenu = {
  subSpace: SubspaceTypes.Home,
  menu: 0,
  subMenu: 0,
};
