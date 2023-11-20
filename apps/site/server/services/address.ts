import prisma from '../../database/prisma/db';

import { geoapifyApiKey } from '../secrets';
import { getNextLang } from '../ssr/getLang';
import { jsonFetcher } from '../../utils/json-fetcher';

import { addressMinimal } from '../../types/prisma/Address/address-minimal';
import { enumChecker } from '@okampus/shared/utils';
import { AddressType, AmenityType, CountryCode } from '@prisma/client';

import type { AddressInfo } from '../types';
import type { AddressMinimal } from '../../types/prisma/Address/address-minimal';

type GeoapifyAddressProperties = {
  lon: number;
  lat: number;
  address_line1?: string;
  address_line2?: string;
  category?: string;
  result_type:
    | 'unknown'
    | 'amenity'
    | 'building'
    | 'street'
    | 'suburb'
    | 'district'
    | 'postcode'
    | 'city'
    | 'county'
    | 'state'
    | 'country';
  name?: string;
  housenumber?: string;
  street: string;
  postcode: string;
  city: string;
  state: string;
  country_code: Lowercase<CountryCode>;
  place_id: string;
};

const PARIS_BIAS = 'proximity:2.3488,48.8534';

const isCountryCode = enumChecker(CountryCode);
export function getCountryCode(code: string): CountryCode {
  if (isCountryCode(code)) return code;
  return CountryCode.XX;
}

const isAddressType = enumChecker(AddressType);
function getAddressType(type: string): AddressType {
  if (isAddressType(type)) return type;
  return AddressType.Unknown;
}

const isAmenityType = enumChecker(AmenityType);
function getAmenityType(category?: string): AmenityType | null {
  if (!category) return null;
  if (isAmenityType(category)) return category;
  return null;
}

export function geoapifyAdressToAddress(geoapifyAddress: GeoapifyAddressProperties): AddressMinimal {
  return {
    geoapifyId: geoapifyAddress.place_id,
    latitude: geoapifyAddress.lat,
    longitude: geoapifyAddress.lon,
    amenityType: getAmenityType(geoapifyAddress.category),
    type: getAddressType(geoapifyAddress.result_type),
    name: geoapifyAddress.name ?? geoapifyAddress.address_line1 ?? '',
    streetNumber: geoapifyAddress.housenumber ?? null,
    street: geoapifyAddress.street,
    zip: geoapifyAddress.postcode,
    city: geoapifyAddress.city,
    country: getCountryCode(geoapifyAddress.country_code.toUpperCase()),
    state: geoapifyAddress.state,
  };
}

export async function getGeoapifyAddressStructured(
  address: AddressInfo,
  lang: Lowercase<CountryCode> = 'fr',
): Promise<AddressMinimal | null> {
  const countryCode = address.countryCode.toLowerCase();
  const street = address.streetNumber ? `${address.streetNumber} ${address.streetName}` : address.streetName;
  const city = address.cityCode ? `${address.city} ${address.cityCode}` : address.city;

  const text = city ? `${street}, ${city}` : street;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${text?.trim()}&filter=countrycode:${countryCode}&format=json&apiKey=${geoapifyApiKey}&lang=${lang}`;

  const data: { results: GeoapifyAddressProperties[] } = await jsonFetcher(url);
  const feature = data.results.at(0);
  if (!feature) return null;

  const { geoapifyId, ...geoapifyAddress } = geoapifyAdressToAddress(feature);

  return await prisma.address.upsert({
    where: { geoapifyId },
    update: geoapifyAddress,
    create: { geoapifyId, ...geoapifyAddress },
    select: addressMinimal.select,
  });
}

export async function getAddress(geoapifyId: string, lang: Lowercase<CountryCode> = 'fr') {
  const address = await prisma.address.findUnique({ where: { geoapifyId } });
  if (address) return address;

  const url = `https://api.geoapify.com/v2/place-details?id=${geoapifyId}&format=json&apiKey=${geoapifyApiKey}&lang=${lang}`;
  const data: { features: { properties?: GeoapifyAddressProperties }[] } = await jsonFetcher(url);

  const feature = data.features.at(0);
  if (!feature?.properties) return null;

  const { geoapifyId: _, ...geoapifyAddress } = geoapifyAdressToAddress(feature.properties);

  return await prisma.address.upsert({
    where: { geoapifyId },
    update: geoapifyAddress,
    create: { geoapifyId, ...geoapifyAddress },
    select: addressMinimal.select,
  });
}

export async function searchAddresses(query: string, limit = 6): Promise<AddressMinimal[]> {
  const url = `v1/geocode/autocomplete?text=${encodeURIComponent(query)}`;

  const lang = getNextLang().slice(0, 2);
  const data: { results: GeoapifyAddressProperties[] } = await jsonFetcher(
    `https://api.geoapify.com/${url}&apiKey=${geoapifyApiKey}&format=json&lang=${lang}&limit=${limit}&type=amenity&bias=${PARIS_BIAS}`,
  );

  return data.results.map(geoapifyAdressToAddress);
}
