import { clsx } from 'clsx';

export type FactCardProps = {
  className?: string;
  title: string;
  information: React.ReactNode;
  informationClassName?: string;
  footer?: React.ReactNode;
};

export function FactCard({ className, title, information, informationClassName, footer }: FactCardProps) {
  return (
    <div className={clsx('flex flex-col justify-between card-sm', className)}>
      <div className="text-white/80 font-medium overflow-ellipsis overflow-hidden mb-2 shrink-0">{title}</div>
      <div className={clsx('text-white text-2xl font-heading overflow-ellipsis overflow-hidden', informationClassName)}>
        {information}
      </div>
      {footer && <div className="text-white/60">{footer}</div>}
    </div>
  );
}
