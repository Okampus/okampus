import IAddress from './IAddress';

import { LocationType } from '@okampus/shared/enums';

import clsx from 'clsx';
import Link from 'next/link';

import type { LocationMinimalInfo } from '../../../types/features/location.info';

export type ILocationProps = { location?: LocationMinimalInfo | null; className?: string; inline?: boolean };
export default function ILocation({ location, className, inline }: ILocationProps) {
  return location ? (
    location.onlineLink ? (
      <Link href={location.onlineLink} className={clsx(className, 'text-blue-400 underline')}>
        {location.type === LocationType.Online ? (
          location.onlineLink
        ) : location.address ? (
          <IAddress address={location.address} />
        ) : (
          <div>{location.locationDetails}</div>
        )}
      </Link>
    ) : location.address ? (
      <IAddress className={className} address={location.address} inline={inline} />
    ) : (
      <div className={className}>{location.locationDetails}</div>
    )
  ) : (
    <div className={className}>Lieu à déterminer</div>
  );
}
