import { fuseClasses } from '@okampus/shared/utils';

type NumberBadgeProps = {
  number: number;
  bgColor?: string;
  textColor?: string;
};

export function NumberBadge({ number, bgColor = '#D23030', textColor = '#fff' }: NumberBadgeProps) {
  return (
    <div
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
      className={fuseClasses('rounded-[50%] flex items-center justify-center', number < 10 ? 'w-6 h-6' : '')}
    >
      {number > 99 ? '99+' : number}
    </div>
  );
}
