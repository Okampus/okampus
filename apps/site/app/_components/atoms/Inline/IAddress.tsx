// import clsx from 'clsx';
import clsx from 'clsx';
import type { AddressMinimal } from '../../../../types/prisma/Address/address-minimal';

export type IAddressProps = { address: AddressMinimal; className?: string };
export default function IAddress({ address, className }: IAddressProps) {
  return (
    <p className={clsx('paragraph', className)}>
      {address.name
        ? `${address.name}, ${address.streetNumber} ${address.street}`
        : `${address.streetNumber} ${address.street}`}
    </p>
  );
  // const coreAddress = address.name
  //   ? `${address.name}, ${address.streetNumber} ${address.street}`
  //   : `${address.streetNumber} ${address.street}`;

  // if (inline) {
  //   return (
  //     <span className={clsx('tabular-nums', className)}>
  //       <span className="text-0">{coreAddress}, </span>
  //       <span className="text-2">
  //         {address.city} {address.zip}
  //       </span>
  //     </span>
  //   );
  // }

  // return (
  //   <div>
  //     <div className="mt-1 text-1 leading-4">{coreAddress}</div>
  //     <div className="text-3">
  //       {address.city} {address.zip}
  //     </div>
  //   </div>
  // );
}
