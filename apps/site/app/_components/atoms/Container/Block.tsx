import clsx from 'clsx';

export type BlockProps = {
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
};

export function Block({ title, children, disabled }: BlockProps) {
  return (
    <div className={clsx('flex flex-col gap-2', disabled && 'opacity-50')}>
      <h3 className="font-semibold text-0">{title}</h3>
      <div className="text-2">{children}</div>
    </div>
  );
}
