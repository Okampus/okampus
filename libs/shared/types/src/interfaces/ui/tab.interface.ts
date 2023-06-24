export interface Tab {
  key: string | number;
  label: React.ReactNode;
  onClick: (tab: string | number) => void;
}
