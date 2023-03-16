import type { EitherOrBoth } from '../../types/only-either.type';

export enum ActionType {
  Do = 'Do',
  Switch = 'Switch',
  Simple = 'Simple',
  Confirm = 'Confirm',
  Pending = 'Pending',
  Danger = 'Danger',
}

export type ActionButtonProps = {
  active?: boolean;
  small?: boolean;
  className?: string;
  disabled?: boolean;
  variant?: ActionType;
  iconActive?: React.ReactNode;
  onClick?: () => void;
} & EitherOrBoth<{ icon: React.ReactNode }, { children: React.ReactNode }>;
