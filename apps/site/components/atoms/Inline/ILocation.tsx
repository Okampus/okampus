import IAddress from './IAddress';

import { LocationType } from '@okampus/shared/enums';

import clsx from 'clsx';
import Link from 'next/link';

import type { LocationBaseInfo } from '@okampus/shared/graphql';

export type ILocationProps = { location?: LocationBaseInfo; className?: string };
export default function ILocation({ location, className }: ILocationProps) {
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
      <IAddress className={className} address={location.address} />
    ) : (
      <div className={className}>{location.locationDetails}</div>
    )
  ) : (
    <div className={className}>Lieu non-renseignée</div>
  );
}
