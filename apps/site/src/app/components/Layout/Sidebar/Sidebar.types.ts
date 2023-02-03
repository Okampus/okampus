import { SubspaceTypes } from '@okampus/shared/types';

export const HOME = SubspaceTypes.Home;
export const ADMIN = SubspaceTypes.Admin;
export const MANAGE = SubspaceTypes.Manage;
export const SEARCH = 'search';

export type SideBubbleType = typeof HOME | typeof ADMIN | typeof MANAGE | typeof SEARCH;

export type SideBubble = {
  subSpace: SideBubbleType;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};
