export type SelectItem<T, Searchable = false> = {
  value: T;
  label: React.ReactNode;
  listLabel?: React.ReactNode;
  groupKey?: string;
} & (Searchable extends true ? { searchValue: string } : { searchValue?: never });
