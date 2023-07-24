import clsx from 'clsx';

export type GroupHeadingProps = {
  label: React.ReactNode;
  type?: 'menu' | 'page';
  icon?: React.ReactNode;
  className?: string;
};
export default function GroupHeading({ label, type = 'menu', icon, className }: GroupHeadingProps) {
  return (
    <h3 className={clsx('flex items-center gap-2.5', className, type === 'menu' ? 'menu-title' : 'page-subtitle')}>
      {icon && <i className="[&>:first-child]:h-5 [&>:first-child]:w-5">{icon}</i>}
      {label}
    </h3>
  );
}
