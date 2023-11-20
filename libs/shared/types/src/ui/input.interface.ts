import type { Control } from 'react-hook-form';

export type BaseInput = {
  name?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
  description?: string;
  error?: string | null | false;
  info?: React.ReactNode;
  loading?: boolean;
  label?: React.ReactNode;
  placeholder?: string;
};

export type UncontrolledInput<T> = BaseInput & { defaultValue?: T; name: string };

export type RHFControl<T, Cancellable = false, Array = false> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { control: Control<any>; name: string; onChange?: never; value?: never }
  | {
      control?: never;
      onChange: (value: Array extends true ? T[] : Cancellable extends true ? T | undefined : T) => void;
      value: Array extends true ? T[] : T | undefined;
    };

export type ControlledInput<T, Cancellable = false, Array = false> = BaseInput & RHFControl<T, Cancellable, Array>;

export type SelectItem<T> = { value: T; label: React.ReactNode };
export type ComboBoxItem<T> = SelectItem<T> & { searchText: string };

export type ControlledMultiSelect<T> = ControlledInput<T, false, true> & { options: SelectItem<T>[] };
export type ControlledSelect<T, Cancellable> = ControlledInput<T, Cancellable> & {
  options: SelectItem<T>[];
};

export type GetOptions<T> = ((search: string) => ComboBoxItem<T>[] | Promise<ComboBoxItem<T>[]>) | ComboBoxItem<T>[];
export type ControlledComboBox<T> = ControlledInput<T, true> & {
  getOptions: GetOptions<T>;
  getOptionsKey: (search: string) => string | null;
  debounce?: number;
};
export type ControlledMultiComboBox<T> = ControlledInput<T, false, true> & {
  getOptions: GetOptions<T>;
  getOptionsKey: (search: string) => string | null;
  debounce?: number;
};
