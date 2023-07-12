import type { Action } from './action.props';

export type MenuProps = {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sections: { title?: React.ReactNode; icon?: React.ReactNode; actions: Action[] }[];
  className?: string;
};
