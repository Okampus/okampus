import clsx from 'clsx';

export type RadioCircleIconProps = {
  sizeClassName?: string;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
};

export default function RadioCircleIcon({
  sizeClassName = 'w-6 h-6',
  className,
  checked,
  disabled,
}: RadioCircleIconProps) {
  return (
    <div
      className={clsx(
        'relative bg-opposite rounded-full shrink-0 aspect-square',
        className,
        sizeClassName,
        disabled && 'opacity-70'
      )}
    >
      <div className="absolute inset-[2px] bg-2 rounded-full">
        {checked && <div className="absolute inset-[3px] bg-opposite rounded-full" />}
      </div>
    </div>
  );
}
