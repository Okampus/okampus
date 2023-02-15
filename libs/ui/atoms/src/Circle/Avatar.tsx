import { getColorHexFromData } from '@okampus/shared/utils';
import clsx from 'clsx';

export type AvatarProps = {
  src?: string;
  name?: string;
  size?: number;
  rounded?: number;
  className?: string;
  active?: boolean;
};

export function Avatar({ src, name, size = 14, rounded = 50, className, active }: AvatarProps) {
  name = name ?? '?';
  return (
    <div
      className={clsx('flex items-center overflow-hidden shrink-0 font-title', className, active && 'ring-4')}
      style={{
        width: `${size / 6}rem`,
        height: `${size / 6}rem`,
        borderRadius: `${rounded}%`,
        fontSize: `${size / 12}rem`,
      }}
    >
      {src ? (
        <img src={src} alt={`${name}`} />
      ) : (
        <div
          className="flex items-center justify-center w-full h-full"
          style={{ backgroundColor: getColorHexFromData(name) }}
        >
          <span className="font-medium text-white">{name[0]}</span>
        </div>
      )}
    </div>
  );
}
