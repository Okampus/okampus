import clsx from 'clsx';

export type TextSectionProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export function TextSection({ title, children, className }: TextSectionProps) {
  return (
    <div className={clsx('flex flex-col gap-5', className)}>
      <div className="text-0 text-xl font-bold tracking-tight">{title}</div>
      <div className="text-2 font-medium leading-7">{children}</div>
    </div>
  );
}
