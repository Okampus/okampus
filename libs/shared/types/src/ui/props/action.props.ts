import type { ReactNode } from 'react';
import type { MenuProps } from './menu.props';

export enum ActionType {
  Action = 'Action',
  Primary = 'Primary',
  Success = 'Success',
  Warning = 'Warning',
  Danger = 'Danger',
  Info = 'Info',
}

export type Action = {
  label?: ReactNode;
  hoverLabel?: ReactNode;
  linkOrActionOrMenu?: string | (() => void) | (() => Promise<void>) | MenuProps;
  active?: boolean;
  disabled?: boolean;
  iconOrSwitch?: ReactNode | ((active: boolean) => ReactNode);
  iconOrSwitchClassName?: string;
  type?: ActionType;
};

export type ActionButtonProps = {
  action: Action;
  children?: ReactNode;
  className?: string;
  iconPosition?: 'left' | 'right';
  inheritLabel?: boolean;
  small?: boolean;
  linkInNewTab?: boolean;
  isLoading?: boolean;
};
