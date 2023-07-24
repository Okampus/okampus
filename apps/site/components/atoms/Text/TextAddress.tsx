import clsx from 'clsx';
import type { AddressBaseInfo } from '@okampus/shared/graphql';

export type TextAddressProps = { address: AddressBaseInfo; className?: string };
export default function TextAddress({ address, className }: TextAddressProps) {
  const addressString = `${address.streetNumber} ${address.street}, ${address.city} ${address.zip}`;

  return (
    <span className={clsx('font-semibold text-1 tabular-nums', className)}>
      {address.name && <span className="font-bold text-0">{address.name}, </span>}
      {addressString}
    </span>
  );
}
