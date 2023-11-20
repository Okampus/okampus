import type { ButtonProps } from '@okampus/shared/types';

export type ClosableNode = {
  node: React.ReactNode;
  header: React.ReactNode;
  buttons?: ButtonProps[];
  description?: React.ReactNode;
  onClose?: () => void;
};
