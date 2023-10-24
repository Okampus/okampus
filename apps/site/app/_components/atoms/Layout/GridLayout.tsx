import clsx from 'clsx';

export type GridLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export default function GridLayout({ children, className }: GridLayoutProps) {
  return (
    <div className={clsx('w-full grid grid-cols-[repeat(auto-fill,minmax(19rem,1fr))] gap-x-6 gap-y-10', className)}>
      {children}
    </div>
  );
}
