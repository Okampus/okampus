import clsx from 'clsx';

export type LabelCardProps = {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  iconClassName?: string;
  className?: string;
  label: string;
  action: string;
  value: React.ReactNode;
  onClick?: () => void;
};

export function LabelCard({ icon, iconClassName, label, action, value, className, onClick }: LabelCardProps) {
  return (
    <div className={clsx('card-md p-4 flex flex-col gap-2', className)} onClick={onClick}>
      <div className="flex gap-item items-center">
        {icon({ className: clsx('w-12 h-12', iconClassName) })}
        <div className="flex items-center">
          <div className="text-2xl font-bold text-0">{value}</div>
          <div className="text-1 font-semibold text-lg ml-2">{label}</div>
        </div>
      </div>
      <div className="flex flex-col gap-2 px-1">
        <div className="text-sm text-1 font-semibold">{action}</div>
      </div>
    </div>
  );
}
