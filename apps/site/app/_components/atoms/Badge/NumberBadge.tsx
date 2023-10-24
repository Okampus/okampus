import clsx from 'clsx';

type NumberBadgeProps = { number: number; bgColor?: string; textColor?: string };
export default function NumberBadge({ number, bgColor = '#D23030', textColor = '#fff' }: NumberBadgeProps) {
  const className = clsx('rounded-[50%] flex items-center justify-center', number < 10 ? 'w-6 h-6' : '');
  return (
    <div style={{ backgroundColor: bgColor, color: textColor }} className={className}>
      {number > 99 ? '99+' : number}
    </div>
  );
}
