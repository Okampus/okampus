import type { AddressMinimalInfo } from './address.info';

export type LocationMinimalInfo = {
  id: string;
  type: string;
  address?: AddressMinimalInfo | null;
  onlineLink?: string;
  locationDetails?: string;
};
