import type { FormState, ServerAction } from '../../api/server';
import type { ActionType } from '@okampus/shared/enums';
import type { LinkProps } from 'next/link';
import type { ReactNode } from 'react';

export type LinkActionProps = LinkProps & { label?: string };
export type MenuActionProps = Omit<MenuButtonProps, 'children'>;

export type ServerActionProps = {
  serverAction: ServerAction<unknown>;
  onAction?: () => void;
  onActionFinish?: (data: FormState<unknown>) => void;
  data?: Record<string, string>;
};

export type Action =
  | string
  | (() => void)
  | (() => Promise<void>)
  | LinkActionProps
  | MenuActionProps
  | ServerActionProps;

export type ActionProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  action?: Action;
  type?: ActionType;
  disabled?: boolean;
  active?: boolean;
  loading?: boolean;
};

export type ActionWithIconProps = ActionProps & { icon: ReactNode; separator?: boolean };

// TODO: improve with custom object action for links, trigger options menu props
export type ButtonProps = Partial<ActionProps> & { className?: string; hoverContent?: ReactNode };

export type MenuButtonProps = {
  children: ReactNode;
  actions: ActionWithIconProps[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};
