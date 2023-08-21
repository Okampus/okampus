export interface LinkItemProps {
  pathname: string;
  label: React.ReactNode;
  href: string;
  className?: string;
  large?: boolean;
  icon?: React.ReactNode;
  customIcon?: boolean;
  checkSelected?: (pathname: string) => boolean;
  onClick?: () => void;
}
