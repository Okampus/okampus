import clsx from 'clsx';
import type { AddressMinimal } from '../../../../types/features/address.info';

export type IAddressProps = { address: AddressMinimal; className?: string; inline?: boolean };
export default function IAddress({ address, className, inline = true }: IAddressProps) {
  const coreAddress = address.name
    ? `${address.name}, ${address.streetNumber} ${address.street}`
    : `${address.streetNumber} ${address.street}`;

  if (inline) {
    return (
      <span className={clsx('tabular-nums', className)}>
        <span className="text-0">{coreAddress}, </span>
        <span className="text-2">
          {address.city} {address.zip}
        </span>
      </span>
    );
  }

  return (
    <div>
      <div className="mt-1 text-1 leading-4">{coreAddress}</div>
      <div className="text-3">
        {address.city} {address.zip}
      </div>
    </div>
  );
}
