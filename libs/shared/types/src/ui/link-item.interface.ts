export interface LinkItemProps {
  pathname: string;
  label: React.ReactNode;
  href: string;
  large?: boolean;
  icon?: React.ReactNode;
  customIcon?: boolean;
  checkSelected?: (pathname: string) => boolean;
}
