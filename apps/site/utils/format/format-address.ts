import type { GeocodeAddress } from '@okampus/shared/types';

export const formatAddress = (address: GeocodeAddress) => {
  if (!address) return '';
  const { streetNumber, street, city, zip } = address;
  return `${streetNumber} ${street}, ${zip} ${city}`;
};
