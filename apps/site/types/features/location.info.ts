import type { AddressMinimalInfo } from './address.info';

export type LocationMinimalInfo = {
  type: string;
  address?: AddressMinimalInfo | null;
  onlineLink?: string;
  locationDetails?: string;
};
