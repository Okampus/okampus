export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export type ToastProps = {
  prefix?: React.ReactNode;
  button?: React.ReactNode;
  useDefaultButton?: boolean;
  message: string;
  type?: ToastType;
  timeout?: number;
  onTimeout?: () => void;
  // onClose?: (id: string) => void;
};
