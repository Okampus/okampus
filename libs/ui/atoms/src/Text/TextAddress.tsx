import clsx from 'clsx';
import type { AddressBaseInfo } from '@okampus/shared/graphql';

export type TextAddressProps = {
  address?: AddressBaseInfo;
  className?: string;
};
export function TextAddress({ address, className }: TextAddressProps) {
  return address ? (
    <span className={clsx('text-lg', className)}>
      <span className="font-semibold">{address.name}</span>, <span>{address.street}</span> · <span>{address.city}</span>
      , <span>{address.country}</span>
    </span>
  ) : (
    <div>Addresse non-renseignée</div>
  );
}
