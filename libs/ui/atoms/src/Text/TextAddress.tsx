import clsx from 'clsx';

export type TextAddressProps = {
  address: { name: string; street: string; city: string; country: string };
  className?: string;
};
export function TextAddress({ address, className }: TextAddressProps) {
  return (
    <span className={clsx('text-lg', className)}>
      <span className="font-semibold">{address.name}</span>, <span>{address.street}</span> · <span>{address.city}</span>
      , <span>{address.country}</span>
    </span>
  );
}
