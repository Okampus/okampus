import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import clsx from 'clsx';

export type SidebarBannerProps = { name: string; banner?: string };
export default function SidebarBanner({ name, banner }: SidebarBannerProps) {
  const header = (
    <>
      <div
        className={clsx(
          'px-4 w-full line-clamp-1 text-lg font-bold flex items-center h-[3.75rem]',
          banner ? 'absolute z-20 text-white' : 'text-0'
        )}
      >
        {name}
      </div>
      {!banner && <hr className="border-color-2 mb-3" />}
    </>
  );

  return banner ? (
    header
  ) : (
    <div className="relative">
      {header}
      {banner ? (
        <>
          <img className="w-full" src={banner} alt={name} style={{ aspectRatio: BANNER_ASPECT_RATIO }} />
          <div className="absolute inset-0 bg-[#00000066]" />
        </>
      ) : null}
    </div>
  );
}
