import { TextAddress } from './TextAddress';
import { Link } from 'react-router-dom';
import { LocationType } from '@okampus/shared/enums';

import type { LocationBaseInfo } from '@okampus/shared/graphql';

export type TextLocationProps = { location?: LocationBaseInfo; className?: string };
export function TextLocation({ location, className }: TextLocationProps) {
  location?.onlineLink;

  return location ? (
    location.onlineLink ? (
      <Link to={location.onlineLink} className={className}>
        {location.type === LocationType.Online ? location.name : <TextAddress address={location.address} />}
      </Link>
    ) : (
      <TextAddress address={location.address} className={className} />
    )
  ) : (
    <div>Lieu non-renseignée</div>
  );
}
