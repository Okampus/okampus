import clsx from 'clsx';
import type { AddressMinimalInfo } from '../../../types/features/address.info';

export type IAddressProps = { address: AddressMinimalInfo; className?: string };
export default function IAddress({ address, className }: IAddressProps) {
  const addressString = `${address.streetNumber} ${address.street}, ${address.city} ${address.zip}`;

  return (
    <span className={clsx('font-semibold text-1 tabular-nums', className)}>
      {address.name && <span className="font-bold text-0">{address.name}, </span>}
      {addressString}
    </span>
  );
}
