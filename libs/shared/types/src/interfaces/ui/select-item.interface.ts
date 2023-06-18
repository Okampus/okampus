export interface SelectItem<T> {
  value: T;
  key?: string | number;
  group?: string;
  label: React.ReactNode;
}
