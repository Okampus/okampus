/* eslint-disable @next/next/no-img-element */
import SideBarTitle from './SidebarTitle';
import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';

export type SidebarBannerProps = { name: string; src?: string | null };
export default function SidebarBanner({ name, src }: SidebarBannerProps) {
  const header = (
    <SideBarTitle className={src ? 'absolute z-20 text-white' : 'text-0'} separator={!src}>
      {name}
    </SideBarTitle>
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
