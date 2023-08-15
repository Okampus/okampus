/* eslint-disable @next/next/no-img-element */
import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import clsx from 'clsx';

export type SidebarBannerProps = { name: string; banner?: string };
export default function SidebarBanner({ name, banner }: SidebarBannerProps) {
  const header = (
    <>
      <div
        className={clsx(
          'px-4 w-full line-clamp-1 text-lg flex items-center h-[var(--h-topbar)]',
          banner ? 'absolute z-20 text-white font-semibold' : 'text-0 font-bold',
        )}
      >
        {name}
      </div>
      {!banner && <hr className="border-color-2 mb-3" />}
    </>
  );

  return banner ? (
    <div className="relative mb-3">
      {header}
      <img className="w-full" src={banner} alt={name} style={{ aspectRatio: BANNER_ASPECT_RATIO }} />
      <div className="absolute inset-0 bg-[#00000066]" />
    </div>
  ) : (
    header
  );
}
