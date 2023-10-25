import IAddress from './IAddress';

import { LocationType } from '@prisma/client';

import clsx from 'clsx';
import Link from 'next/link';

import type { LocationMinimalInfo } from '../../../../types/features/location.info';

export type ILocationProps = { location?: LocationMinimalInfo | null; className?: string; inline?: boolean };
export default function ILocation({ location, className, inline }: ILocationProps) {
  return location ? (
    location.link ? (
      <Link href={location.link} className={clsx(className, 'text-blue-400 underline')}>
        {location.type === LocationType.Online ? (
          location.link
        ) : location.address ? (
          <IAddress address={location.address} />
        ) : (
          <div>{location.name}</div>
        )}
      </Link>
    ) : location.address ? (
      <IAddress className={className} address={location.address} inline={inline} />
    ) : (
      <div className={className}>{location.name}</div>
    )
  ) : (
    <div className={className}>Lieu à déterminer</div>
  );
}
