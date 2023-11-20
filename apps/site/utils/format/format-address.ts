import type { AddressMinimal } from '../../types/prisma/Address/address-minimal';

export const formatAddress = (address: AddressMinimal) => {
  if (!address) return '';
  const { streetNumber, street, city, zip } = address;
  return `${streetNumber} ${street}, ${zip} ${city}`;
};
