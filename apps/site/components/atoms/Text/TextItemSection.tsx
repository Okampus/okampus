import clsx from 'clsx';

export type TextItemSectionProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

export default function TextItemSection({ title, children, className }: TextItemSectionProps) {
  return (
    <div className={clsx('flex flex-col gap-4', className)}>
      <div className="text-1 opacity-75 uppercase text-xs text font-bold tracking-tight">{title}</div>
      <div className="text-0 font-medium leading-7">{children}</div>
    </div>
  );
}
