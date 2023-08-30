/* eslint-disable @next/next/no-img-element */
import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import clsx from 'clsx';

export type SidebarBannerProps = { name: string; src?: string };
export default function SidebarBanner({ name, src }: SidebarBannerProps) {
  const header = (
    <>
      <div
        className={clsx(
          'px-4 w-full line-clamp-1 text-lg flex font-semibold items-center h-[var(--h-topbar)]',
          src ? 'absolute z-20 text-white' : 'text-0',
        )}
      >
        {name}
      </div>
      {!src && <hr className="border-color-1 mb-3" />}
    </>
  );

  return src ? (
    <div className="relative mb-3">
      {header}
      <img className="w-full" src={src} alt={name} style={{ aspectRatio: BANNER_ASPECT_RATIO }} />
      <div className="absolute inset-0 bg-[#00000066]" />
    </div>
  ) : (
    header
  );
}
