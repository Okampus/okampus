export type ToastType = 'success' | 'error' | 'info';

export type ToastProps = {
  id: string;
  type: ToastType;
  message: string;
  timeout?: number;
  onTimeout?: (id: string) => void;
  onClose?: (id: string) => void;
};
