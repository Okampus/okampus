import { AddressType } from '@prisma/client';

import type { Locale } from '../../config/i18n';
import type { AddressMinimal } from '../../types/prisma/Address/address-minimal';

const toBeAnnounced: Record<Locale, string> = {
  'fr-FR': 'À déterminer',
  'en-US': 'TBA',
};

export const formatAddress = (locale: Locale, address?: AddressMinimal | null) => {
  if (!address) return toBeAnnounced[locale];

  const { name, street, streetNumber, zip, city, state, country, type } = address;
  if (type === AddressType.Country) return new Intl.DisplayNames([locale], { type: 'region' }).of(country) ?? country;
  if (type === AddressType.State) return `${state}, ${country}`;

  if (address.name) return `${streetNumber} ${street}, ${zip} ${city}`.trim().replace(/,$/, '').replaceAll(/ +/g, '');
  return `${name}, ${streetNumber} ${street}, ${zip} ${city}`.trim().replace(/,$/, '').replaceAll(/ +/g, '');
};
