export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
}

export type ToastProps = {
  id: string;
  message: string;
  type?: ToastType;
  timeout?: number;
  onTimeout?: (id: string) => void;
  onClose?: (id: string) => void;
};
