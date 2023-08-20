import type { SelectItem } from './select-item.interface';

export type UncontrolledInput<T> = {
  name: string;
  defaultValue?: T;
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

export type UncontrolledSelect<Searchable = false> = UncontrolledInput<string> & {
  options: SelectItem<string, Searchable>[];
};

export type ControlledInput<T> = Omit<UncontrolledInput<T>, 'defaultValue'> & {
  value: T;
};

export type ControlledSelect<T, Searchable = false> = Omit<UncontrolledInput<T>, 'defaultValue'> & {
  onChange: (value: T) => void;
  value: T | null;
  options: SelectItem<T, Searchable>[];
};

export type ControlledMultiSelect<T, Searchable = false> = Omit<UncontrolledInput<T>, 'defaultValue'> & {
  onChange: (value: T[]) => void;
  value: T[];
  options: SelectItem<T, Searchable>[];
};
