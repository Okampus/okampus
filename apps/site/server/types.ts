import type { CountryCode } from '@prisma/client';

export type AddressInfo = {
  streetNumber?: string;
  streetName: string;
  city?: string;
  cityCode?: string;
  countryCode: CountryCode;
};

export type CompanyInfo = {
  nationalId: string;
  type?: string;
  activity?: string;
  name: string;
  address: AddressInfo;
};
