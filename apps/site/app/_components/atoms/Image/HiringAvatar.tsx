import type { CSSProperties } from 'react';

export type HiringAvatarProps = {
  size?: number;
};

const avatarClass =
  'flex justify-center items-center rounded-full overflow-hidden shrink-0 select-none font-bold text-opposite tracking-tighter bg-[var(--bg-opposite)]';

export default function HiringAvatar({ size = 40 }: HiringAvatarProps) {
  const style: CSSProperties = { fontSize: `${size / 68}rem` };
  style.height = `${size / 16}rem`;
  style.width = style.height;

  return (
    <div className={avatarClass} style={style}>
      Recrute !
    </div>
  );
}
